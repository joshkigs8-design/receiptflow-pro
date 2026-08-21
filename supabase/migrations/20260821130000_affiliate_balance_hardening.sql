-- Affiliate Balance & Withdrawal Hardening Migration
-- Addresses: race conditions, denormalized balance, negative balance prevention, concurrent withdrawal safety

-- ============================================================
-- 1. ADD "processing" STATUS TO WITHDRAWALS
-- ============================================================
ALTER TABLE public.withdrawals
  DROP CONSTRAINT IF EXISTS withdrawals_status_check;

ALTER TABLE public.withdrawals
  ADD CONSTRAINT withdrawals_status_check
  CHECK (status IN ('pending', 'processing', 'paid', 'rejected'));

COMMENT ON COLUMN public.withdrawals.status IS
  'pending=user requested, processing=admin reviewing, paid=completed, rejected=returned to balance';

-- ============================================================
-- 2. ADD ADMIN NOTE COLUMN TO WITHDRAWALS
-- ============================================================
ALTER TABLE public.withdrawals
  ADD COLUMN IF NOT EXISTS admin_note text;

COMMENT ON COLUMN public.withdrawals.admin_note IS 'Admin notes when processing/rejecting withdrawal';

-- ============================================================
-- 2b. ADD M-PESA PHONE NUMBER COLUMN TO WITHDRAWALS
-- ============================================================
ALTER TABLE public.withdrawals
  ADD COLUMN IF NOT EXISTS mpesa_phone text;

COMMENT ON COLUMN public.withdrawals.mpesa_phone IS 'M-Pesa phone number provided by affiliate for payout';

-- ============================================================
-- 3. CREATE LEDGER-BASED BALANCE FUNCTION (authoritative)
-- ============================================================
-- Available Balance = confirmed commissions - reserved/pending/processing/paid withdrawals
-- This is the SOURCE OF TRUTH, not the denormalized pending_balance column

CREATE OR REPLACE FUNCTION public.get_affiliate_available_balance(_affiliate_id uuid)
RETURNS numeric LANGUAGE sql STABLE SET search_path = public AS $$
  SELECT COALESCE((
    SELECT SUM(c.amount)
    FROM public.commissions c
    WHERE c.affiliate_id = _affiliate_id
      AND c.status IN ('available', 'withdrawn')
  ), 0) - COALESCE((
    SELECT SUM(w.amount)
    FROM public.withdrawals w
    WHERE w.affiliate_id = _affiliate_id
      AND w.status IN ('pending', 'processing', 'paid')
  ), 0);
$$;

GRANT EXECUTE ON FUNCTION public.get_affiliate_available_balance(uuid) TO authenticated;

-- ============================================================
-- 4. CREATE TOTAL EARNED BALANCE FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_affiliate_total_earned(_affiliate_id uuid)
RETURNS numeric LANGUAGE sql STABLE SET search_path = public AS $$
  SELECT COALESCE(SUM(c.amount), 0)
  FROM public.commissions c
  WHERE c.affiliate_id = _affiliate_id
    AND c.status IN ('available', 'withdrawn');
$$;

GRANT EXECUTE ON FUNCTION public.get_affiliate_total_earned(uuid) TO authenticated;

-- ============================================================
-- 5. CREATE TOTAL WITHDRAWN BALANCE FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_affiliate_total_withdrawn(_affiliate_id uuid)
RETURNS numeric LANGUAGE sql STABLE SET search_path = public AS $$
  SELECT COALESCE(SUM(w.amount), 0)
  FROM public.withdrawals w
  WHERE w.affiliate_id = _affiliate_id
    AND w.status = 'paid';
$$;

GRANT EXECUTE ON FUNCTION public.get_affiliate_total_withdrawn(uuid) TO authenticated;

-- ============================================================
-- 6. HARDENED WITHDRAWAL REQUEST FUNCTION WITH ROW LOCKING
-- ============================================================
-- Uses SELECT FOR UPDATE to prevent race conditions
-- Validates against LEDGER balance, not denormalized column

CREATE OR REPLACE FUNCTION public.request_withdrawal(_affiliate_id uuid, _amount numeric, _mpesa_phone text)
RETURNS public.withdrawals LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  aff public.affiliates;
  wd public.withdrawals;
  available_balance numeric;
BEGIN
  -- Lock the affiliate row to prevent concurrent withdrawal requests
  SELECT * INTO aff
  FROM public.affiliates
  WHERE user_id = _affiliate_id
  FOR UPDATE;

  IF aff IS NULL THEN
    RAISE EXCEPTION 'Affiliate not found';
  END IF;

  IF aff.status <> 'active' THEN
    RAISE EXCEPTION 'Affiliate account is not active';
  END IF;

  -- Compute ACTUAL available balance from ledger (source of truth)
  available_balance := public.get_affiliate_available_balance(_affiliate_id);

  IF _amount < 300 THEN
    RAISE EXCEPTION 'Minimum withdrawal is KSh 300';
  END IF;

  IF _amount > available_balance THEN
    RAISE EXCEPTION 'Insufficient available balance. Available: ' || available_balance;
  END IF;

  IF _mpesa_phone IS NULL OR trim(_mpesa_phone) = '' THEN
    RAISE EXCEPTION 'M-Pesa phone number is required';
  END IF;

  -- Create withdrawal request (status = pending)
  INSERT INTO public.withdrawals (affiliate_id, amount, status, mpesa_phone)
  VALUES (_affiliate_id, _amount, 'pending', trim(_mpesa_phone))
  RETURNING * INTO wd;

  -- Update denormalized cache (kept for UI performance, but NOT authoritative)
  UPDATE public.affiliates
  SET total_commissions_earned = public.get_affiliate_total_earned(_affiliate_id),
      total_withdrawn = public.get_affiliate_total_withdrawn(_affiliate_id)
  WHERE user_id = _affiliate_id;

  RETURN wd;
END; $$;

REVOKE ALL ON FUNCTION public.request_withdrawal(uuid, numeric, text) FROM public;
GRANT EXECUTE ON FUNCTION public.request_withdrawal(uuid, numeric, text) TO authenticated;

-- ============================================================
-- 7. HARDENED PROCESS WITHDRAWAL (ADMIN) WITH LEDGER SYNC
-- ============================================================

CREATE OR REPLACE FUNCTION public.process_withdrawal(_withdrawal_id uuid, _mpesa_reference text, _admin_id uuid)
RETURNS public.withdrawals LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  wd public.withdrawals;
  aff public.affiliates;
BEGIN
  -- Verify admin
  IF NOT public.has_role(_admin_id, 'admin') THEN
    RAISE EXCEPTION 'Admin access required';
  END IF;

  -- Lock withdrawal row
  SELECT * INTO wd
  FROM public.withdrawals
  WHERE id = _withdrawal_id
  FOR UPDATE;

  IF wd IS NULL THEN
    RAISE EXCEPTION 'Withdrawal not found';
  END IF;

  IF wd.status NOT IN ('pending', 'processing') THEN
    RAISE EXCEPTION 'Withdrawal already processed (status: ' || wd.status || ')';
  END IF;

  IF _mpesa_reference IS NULL OR trim(_mpesa_reference) = '' THEN
    RAISE EXCEPTION 'M-Pesa reference required';
  END IF;

  -- Update withdrawal to paid
  UPDATE public.withdrawals
  SET status = 'paid',
      mpesa_reference = trim(_mpesa_reference),
      processed_at = now(),
      processed_by = _admin_id
  WHERE id = _withdrawal_id
  RETURNING * INTO wd;

  -- Sync denormalized cache from ledger
  UPDATE public.affiliates
  SET total_commissions_earned = public.get_affiliate_total_earned(wd.affiliate_id),
      total_withdrawn = public.get_affiliate_total_withdrawn(wd.affiliate_id)
  WHERE user_id = wd.affiliate_id;

  RETURN wd;
END; $$;

REVOKE ALL ON FUNCTION public.process_withdrawal(uuid, text, uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.process_withdrawal(uuid, text, uuid) TO authenticated;

-- ============================================================
-- 8. HARDENED REJECT WITHDRAWAL (ADMIN) WITH LEDGER SYNC
-- ============================================================

CREATE OR REPLACE FUNCTION public.reject_withdrawal(_withdrawal_id uuid, _admin_id uuid)
RETURNS public.withdrawals LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  wd public.withdrawals;
BEGIN
  IF NOT public.has_role(_admin_id, 'admin') THEN
    RAISE EXCEPTION 'Admin access required';
  END IF;

  -- Lock withdrawal row
  SELECT * INTO wd
  FROM public.withdrawals
  WHERE id = _withdrawal_id
  FOR UPDATE;

  IF wd IS NULL THEN
    RAISE EXCEPTION 'Withdrawal not found';
  END IF;

  IF wd.status NOT IN ('pending', 'processing') THEN
    RAISE EXCEPTION 'Withdrawal already processed (status: ' || wd.status || ')';
  END IF;

  -- Update withdrawal to rejected
  UPDATE public.withdrawals
  SET status = 'rejected',
      processed_at = now(),
      processed_by = _admin_id
  WHERE id = _withdrawal_id
  RETURNING * INTO wd;

  -- Sync denormalized cache from ledger
  UPDATE public.affiliates
  SET total_commissions_earned = public.get_affiliate_total_earned(wd.affiliate_id),
      total_withdrawn = public.get_affiliate_total_withdrawn(wd.affiliate_id)
  WHERE user_id = wd.affiliate_id;

  RETURN wd;
END; $$;

REVOKE ALL ON FUNCTION public.reject_withdrawal(uuid, uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.reject_withdrawal(uuid, uuid) TO authenticated;

-- ============================================================
-- 9. ADD "processing" TRANSITION FOR ADMIN WORKFLOW
-- ============================================================

CREATE OR REPLACE FUNCTION public.start_processing_withdrawal(_withdrawal_id uuid, _admin_id uuid)
RETURNS public.withdrawals LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  wd public.withdrawals;
BEGIN
  IF NOT public.has_role(_admin_id, 'admin') THEN
    RAISE EXCEPTION 'Admin access required';
  END IF;

  SELECT * INTO wd
  FROM public.withdrawals
  WHERE id = _withdrawal_id
  FOR UPDATE;

  IF wd IS NULL THEN
    RAISE EXCEPTION 'Withdrawal not found';
  END IF;

  IF wd.status <> 'pending' THEN
    RAISE EXCEPTION 'Can only process pending withdrawals';
  END IF;

  UPDATE public.withdrawals
  SET status = 'processing',
      processed_by = _admin_id
  WHERE id = _withdrawal_id
  RETURNING * INTO wd;

  RETURN wd;
END; $$;

REVOKE ALL ON FUNCTION public.start_processing_withdrawal(uuid, uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.start_processing_withdrawal(uuid, uuid) TO authenticated;

-- ============================================================
-- 10. BALANCE INTEGRITY CHECK TRIGGER
-- ============================================================
-- Ensures denormalized cache never diverges from ledger by more than rounding

CREATE OR REPLACE FUNCTION public.check_affiliate_balance_integrity()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  ledger_earned numeric;
  ledger_withdrawn numeric;
BEGIN
  -- Only check on stats updates
  IF NEW.total_commissions_earned IS DISTINCT FROM OLD.total_commissions_earned
     OR NEW.total_withdrawn IS DISTINCT FROM OLD.total_withdrawn THEN

    ledger_earned := public.get_affiliate_total_earned(NEW.user_id);
    ledger_withdrawn := public.get_affiliate_total_withdrawn(NEW.user_id);

    -- Allow small rounding differences (0.01)
    IF abs(NEW.total_commissions_earned - ledger_earned) > 0.01
       OR abs(NEW.total_withdrawn - ledger_withdrawn) > 0.01 THEN
      RAISE EXCEPTION 'Balance integrity violation: denormalized cache diverges from ledger';
    END IF;
  END IF;

  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS affiliate_balance_integrity ON public.affiliates;
CREATE TRIGGER affiliate_balance_integrity
  BEFORE UPDATE ON public.affiliates
  FOR EACH ROW EXECUTE FUNCTION public.check_affiliate_balance_integrity();

-- ============================================================
-- 11. SYNC EXISTING DATA: Recompute all affiliate caches from ledger
-- ============================================================

DO $$
DECLARE
  aff_record record;
BEGIN
  FOR aff_record IN SELECT user_id FROM public.affiliates LOOP
    UPDATE public.affiliates
    SET total_commissions_earned = public.get_affiliate_total_earned(aff_record.user_id),
        total_withdrawn = public.get_affiliate_total_withdrawn(aff_record.user_id)
    WHERE user_id = aff_record.user_id;
  END LOOP;
END $$;

-- ============================================================
-- 12. UPDATE get_affiliate_dashboard TO USE LEDGER FUNCTIONS
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_affiliate_dashboard(_user_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'affiliate', jsonb_build_object(
      'user_id', a.user_id,
      'referral_code', a.referral_code,
      'status', a.status,
      'total_referrals', a.total_referrals,
      'total_commissions_earned', public.get_affiliate_total_earned(a.user_id),
      'total_withdrawn', public.get_affiliate_total_withdrawn(a.user_id),
      'pending_balance', public.get_affiliate_available_balance(a.user_id)
    ),
    'available_balance', public.get_affiliate_available_balance(a.user_id),
    'pending_commissions', (
      SELECT COALESCE(SUM(c.amount), 0)
      FROM public.commissions c
      WHERE c.affiliate_id = a.user_id AND c.status = 'pending'
    ),
    'referral_count', (
      SELECT COUNT(*) FROM public.referrals r WHERE r.affiliate_id = a.user_id
    ),
    'commission_count', (
      SELECT COUNT(*) FROM public.commissions c WHERE c.affiliate_id = a.user_id
    ),
    'successful_referrals', (
      SELECT COUNT(DISTINCT c.referral_id)
      FROM public.commissions c
      WHERE c.affiliate_id = a.user_id AND c.status IN ('available', 'withdrawn')
    ),
    'referrals', (
      SELECT jsonb_agg(jsonb_build_object(
        'id', r.id,
        'referred_id', r.referred_id,
        'referral_code_used', r.referral_code_used,
        'created_at', r.created_at,
        'user_email', u.email,
        'user_name', p.full_name,
        'has_paid', EXISTS (
          SELECT 1 FROM public.subscription_payments sp
          WHERE sp.user_id = r.referred_id AND sp.status = 'success'
        )
      ) ORDER BY r.created_at DESC)
      FROM public.referrals r
      LEFT JOIN auth.users u ON u.id = r.referred_id
      LEFT JOIN public.profiles p ON p.id = r.referred_id
      WHERE r.affiliate_id = a.user_id
    ),
    'commissions', (
      SELECT jsonb_agg(jsonb_build_object(
        'id', c.id,
        'amount', c.amount,
        'status', c.status,
        'created_at', c.created_at,
        'subscription_payment_id', c.subscription_payment_id,
        'referral_id', c.referral_id
      ) ORDER BY c.created_at DESC)
      FROM public.commissions c
      WHERE c.affiliate_id = a.user_id
    ),
    'withdrawals', (
      SELECT jsonb_agg(jsonb_build_object(
        'id', w.id,
        'amount', w.amount,
        'status', w.status,
        'mpesa_reference', w.mpesa_reference,
        'admin_note', w.admin_note,
        'requested_at', w.requested_at,
        'processed_at', w.processed_at
      ) ORDER BY w.requested_at DESC)
      FROM public.withdrawals w
      WHERE w.affiliate_id = a.user_id
    )
  ) INTO result
  FROM public.affiliates a
  WHERE a.user_id = _user_id;

  IF result IS NULL THEN
    RETURN jsonb_build_object(
      'affiliate', null,
      'available_balance', 0,
      'pending_commissions', 0,
      'referral_count', 0,
      'commission_count', 0,
      'successful_referrals', 0,
      'referrals', '[]'::jsonb,
      'commissions', '[]'::jsonb,
      'withdrawals', '[]'::jsonb
    );
  END IF;

  RETURN result;
END; $$;

REVOKE ALL ON FUNCTION public.get_affiliate_dashboard(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.get_affiliate_dashboard(uuid) TO authenticated;

-- ============================================================
-- 13. UPDATE VIEW TO USE LEDGER FUNCTIONS
-- ============================================================

DROP VIEW IF EXISTS public.affiliate_dashboard;

CREATE VIEW public.affiliate_dashboard AS
SELECT
  a.user_id,
  a.referral_code,
  a.status,
  a.total_referrals,
  public.get_affiliate_total_earned(a.user_id) as total_commissions_earned,
  public.get_affiliate_total_withdrawn(a.user_id) as total_withdrawn,
  public.get_affiliate_available_balance(a.user_id) as pending_balance,
  public.get_affiliate_available_balance(a.user_id) as available_balance,
  (
    SELECT COALESCE(SUM(c.amount), 0)
    FROM public.commissions c
    WHERE c.affiliate_id = a.user_id AND c.status = 'pending'
  ) as pending_commissions,
  (
    SELECT COUNT(*)
    FROM public.referrals r
    WHERE r.affiliate_id = a.user_id
  ) as referral_count,
  (
    SELECT COUNT(*)
    FROM public.commissions c
    WHERE c.affiliate_id = a.user_id
  ) as commission_count
FROM public.affiliates a;

GRANT SELECT ON public.affiliate_dashboard TO authenticated;
GRANT ALL ON public.affiliate_dashboard TO service_role;

ALTER VIEW public.affiliate_dashboard SET (security_invoker = on);

-- ============================================================
-- 14. ADD INDEX FOR WITHDRAWAL QUERIES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_withdrawals_affiliate_status
  ON public.withdrawals(affiliate_id, status);

-- ============================================================
-- 15. DOCUMENTATION: Balance Computation Rules
-- ============================================================
COMMENT ON TABLE public.commissions IS
  'Commission earned when a referred user makes a successful payment.
   Status flow: pending -> available -> withdrawn.
   Available for withdrawal when status = available.';

COMMENT ON TABLE public.withdrawals IS
  'Affiliate withdrawal requests.
   Status flow: pending -> processing -> paid OR rejected.
   Balance reserved when status IN (pending, processing, paid).';

COMMENT ON FUNCTION public.get_affiliate_available_balance(uuid) IS
  'AUTHORITATIVE available balance calculation.
   = SUM(commissions where status IN (available, withdrawn))
   - SUM(withdrawals where status IN (pending, processing, paid))
   This is the source of truth. The affiliates.pending_balance column is a cached copy only.';