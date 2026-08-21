-- Affiliate System Migration
-- Creates: affiliates, referrals, commissions, withdrawals tables with RLS

-- 1. AFFILIATES TABLE
-- Tracks affiliate status and lifetime stats per user
CREATE TABLE public.affiliates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'banned')),
  total_referrals integer NOT NULL DEFAULT 0,
  total_commissions_earned numeric NOT NULL DEFAULT 0,
  total_withdrawn numeric NOT NULL DEFAULT 0,
  pending_balance numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.affiliates IS 'Affiliate program enrollment and lifetime stats per user';
COMMENT ON COLUMN public.affiliates.referral_code IS 'Unique code used for referral links (e.g., RRP-ABC123)';
COMMENT ON COLUMN public.affiliates.pending_balance IS 'Commissions earned but not yet withdrawn (available for withdrawal)';

-- 2. REFERRALS TABLE
-- Permanent record of who referred whom (set once at signup)
CREATE TABLE public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code_used text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.referrals IS 'Permanent referral relationships - one referred user per row';
COMMENT ON COLUMN public.referrals.referral_code_used IS 'The referral code the referred user used at signup';

-- 3. COMMISSIONS TABLE
-- One row per qualifying successful payment by a referred user
CREATE TABLE public.commissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_id uuid NOT NULL REFERENCES public.referrals(id) ON DELETE CASCADE,
  subscription_payment_id uuid NOT NULL REFERENCES public.subscription_payments(id) ON DELETE CASCADE,
  amount numeric NOT NULL DEFAULT 50 CHECK (amount = 50),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'available', 'withdrawn')),
  created_at timestamptz NOT NULL DEFAULT now(),
  -- Prevent duplicate commission for same payment + affiliate
  UNIQUE (subscription_payment_id, affiliate_id)
);

COMMENT ON TABLE public.commissions IS 'Commission earned when a referred user makes a successful payment';
COMMENT ON COLUMN public.commissions.amount IS 'Fixed at KSh 50 per qualifying payment';
COMMENT ON COLUMN public.commissions.status IS 'pending=awaiting payment confirmation, available=ready for withdrawal, withdrawn=paid out';

-- 4. WITHDRAWALS TABLE
-- Manual payout requests by affiliates, processed by admins
CREATE TABLE public.withdrawals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount numeric NOT NULL CHECK (amount >= 300),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'rejected')),
  mpesa_reference text,
  requested_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  processed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

COMMENT ON TABLE public.withdrawals IS 'Affiliate withdrawal requests - manual admin processing';
COMMENT ON COLUMN public.withdrawals.amount IS 'Minimum KSh 300 per withdrawal';
COMMENT ON COLUMN public.withdrawals.mpesa_reference IS 'M-Pesa transaction/reference number entered by admin when marking paid';

-- GRANTS
GRANT SELECT, INSERT, UPDATE ON public.affiliates TO authenticated;
GRANT ALL ON public.affiliates TO service_role;

GRANT SELECT, INSERT ON public.referrals TO authenticated;
GRANT ALL ON public.referrals TO service_role;

GRANT SELECT ON public.commissions TO authenticated;
GRANT ALL ON public.commissions TO service_role;

GRANT SELECT, INSERT ON public.withdrawals TO authenticated;
GRANT ALL ON public.withdrawals TO service_role;

-- RLS ENABLE
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES: AFFILIATES
-- Users can read their own affiliate record
CREATE POLICY "affiliate own read" ON public.affiliates
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Users can insert their own affiliate record (enrollment)
CREATE POLICY "affiliate own insert" ON public.affiliates
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can update only allowed fields on their own record (not stats)
CREATE POLICY "affiliate own update" ON public.affiliates
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (
    user_id = auth.uid()
    AND (OLD.total_referrals = NEW.total_referrals)
    AND (OLD.total_commissions_earned = NEW.total_commissions_earned)
    AND (OLD.total_withdrawn = NEW.total_withdrawn)
    AND (OLD.pending_balance = NEW.pending_balance)
    AND (OLD.referral_code = NEW.referral_code)
  );

-- Admins can do everything
CREATE POLICY "affiliate admin all" ON public.affiliates
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS POLICIES: REFERRALS
-- Users can read referrals where they are the affiliate OR the referred user
CREATE POLICY "referral read own" ON public.referrals
  FOR SELECT TO authenticated
  USING (
    affiliate_id = auth.uid()
    OR referred_id = auth.uid()
    OR public.has_role(auth.uid(), 'admin')
  );

-- Referral creation happens via server function (service role) - no user INSERT policy needed
-- But allow service role via GRANT above

-- Admins can read all
CREATE POLICY "referral admin all" ON public.referrals
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS POLICIES: COMMISSIONS
-- Users can read their own commissions (where they are the affiliate)
CREATE POLICY "commission own read" ON public.commissions
  FOR SELECT TO authenticated
  USING (
    affiliate_id = auth.uid()
    OR public.has_role(auth.uid(), 'admin')
  );

-- Commission creation happens via server function (service role)
-- Users CANNOT insert/update/delete commissions directly
-- Admins can read all
CREATE POLICY "commission admin all" ON public.commissions
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS POLICIES: WITHDRAWALS
-- Users can read their own withdrawals
CREATE POLICY "withdrawal own read" ON public.withdrawals
  FOR SELECT TO authenticated
  USING (
    affiliate_id = auth.uid()
    OR public.has_role(auth.uid(), 'admin')
  );

-- Users can create their own withdrawal requests (amount validated by CHECK constraint)
CREATE POLICY "withdrawal own insert" ON public.withdrawals
  FOR INSERT TO authenticated
  WITH CHECK (affiliate_id = auth.uid());

-- Users CANNOT update their own withdrawals (status, mpesa_reference, processed_at, processed_by are admin-only)
-- Admins can manage all withdrawals
CREATE POLICY "withdrawal admin all" ON public.withdrawals
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- INDEXES
CREATE INDEX idx_affiliates_user_id ON public.affiliates(user_id);
CREATE INDEX idx_affiliates_referral_code ON public.affiliates(referral_code);
CREATE INDEX idx_referrals_affiliate_id ON public.referrals(affiliate_id);
CREATE INDEX idx_referrals_referred_id ON public.referrals(referred_id);
CREATE INDEX idx_commissions_affiliate_id ON public.commissions(affiliate_id);
CREATE INDEX idx_commissions_referral_id ON public.commissions(referral_id);
CREATE INDEX idx_commissions_subscription_payment_id ON public.commissions(subscription_payment_id);
CREATE INDEX idx_commissions_status ON public.commissions(status);
CREATE INDEX idx_withdrawals_affiliate_id ON public.withdrawals(affiliate_id);
CREATE INDEX idx_withdrawals_status ON public.withdrawals(status);

-- UPDATED_AT TRIGGERS
CREATE TRIGGER affiliates_touch BEFORE UPDATE ON public.affiliates
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- FUNCTION: Generate unique referral code
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS text LANGUAGE plpgsql VOLATILE SET search_path = public AS $$
DECLARE
  code text;
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  i int;
BEGIN
  LOOP
    code := 'RRP-';
    FOR i IN 1..6 LOOP
      code := code || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.affiliates WHERE referral_code = code);
  END LOOP;
  RETURN code;
END; $$;

-- FUNCTION: Enroll user as affiliate (creates affiliate record with referral code)
CREATE OR REPLACE FUNCTION public.enroll_affiliate(_user_id uuid)
RETURNS public.affiliates LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  aff public.affiliates;
BEGIN
  INSERT INTO public.affiliates (user_id, referral_code)
  VALUES (_user_id, public.generate_referral_code())
  ON CONFLICT (user_id) DO UPDATE SET
    referral_code = EXCLUDED.referral_code
  RETURNING * INTO aff;
  RETURN aff;
END; $$;

REVOKE ALL ON FUNCTION public.enroll_affiliate(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.enroll_affiliate(uuid) TO authenticated;

-- FUNCTION: Record referral at signup (called from handle_new_user trigger or server fn)
-- Returns the affiliate_id if referral code was valid, NULL otherwise
CREATE OR REPLACE FUNCTION public.record_referral(_referred_id uuid, _referral_code text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  aff_id uuid;
  ref public.referrals;
BEGIN
  -- Find affiliate by referral code
  SELECT user_id INTO aff_id
  FROM public.affiliates
  WHERE referral_code = upper(trim(_referral_code))
    AND status = 'active';

  IF aff_id IS NULL THEN
    RETURN NULL;
  END IF;

  -- Prevent self-referral
  IF aff_id = _referred_id THEN
    RETURN NULL;
  END IF;

  -- Insert referral (unique constraint on referred_id prevents duplicates)
  INSERT INTO public.referrals (affiliate_id, referred_id, referral_code_used)
  VALUES (aff_id, _referred_id, upper(trim(_referral_code)))
  ON CONFLICT (referred_id) DO NOTHING
  RETURNING * INTO ref;

  -- Update affiliate stats
  UPDATE public.affiliates
  SET total_referrals = total_referrals + 1
  WHERE user_id = aff_id;

  RETURN aff_id;
END; $$;

REVOKE ALL ON FUNCTION public.record_referral(uuid, text) FROM public;
GRANT EXECUTE ON FUNCTION public.record_referral(uuid, text) TO authenticated;

-- FUNCTION: Create commission when referred user makes successful payment
-- Called from verifyCheckout / webhook after payment confirmed
-- Idempotent: unique constraint on (subscription_payment_id, affiliate_id) prevents duplicates
CREATE OR REPLACE FUNCTION public.create_commission(_subscription_payment_id uuid)
RETURNS public.commissions LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  sp public.subscription_payments;
  ref public.referrals;
  comm public.commissions;
  aff public.affiliates;
BEGIN
  -- Get the subscription payment
  SELECT * INTO sp
  FROM public.subscription_payments
  WHERE id = _subscription_payment_id;

  IF sp IS NULL OR sp.status <> 'success' THEN
    RAISE EXCEPTION 'Invalid or non-successful payment';
  END IF;

  -- Find referral for this user
  SELECT * INTO ref
  FROM public.referrals
  WHERE referred_id = sp.user_id;

  IF ref IS NULL THEN
    RAISE EXCEPTION 'No referral found for user';
  END IF;

  -- Insert commission (unique constraint prevents duplicates)
  INSERT INTO public.commissions (affiliate_id, referral_id, subscription_payment_id, amount, status)
  VALUES (ref.affiliate_id, ref.id, _subscription_payment_id, 50, 'available')
  ON CONFLICT (subscription_payment_id, affiliate_id) DO NOTHING
  RETURNING * INTO comm;

  -- If commission was created (not duplicate), update affiliate stats
  IF comm IS NOT NULL THEN
    UPDATE public.affiliates
    SET total_commissions_earned = total_commissions_earned + 50,
        pending_balance = pending_balance + 50
    WHERE user_id = ref.affiliate_id;
  END IF;

  RETURN comm;
END; $$;

REVOKE ALL ON FUNCTION public.create_commission(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.create_commission(uuid) TO authenticated;

-- FUNCTION: Request withdrawal (validates minimum and available balance)
CREATE OR REPLACE FUNCTION public.request_withdrawal(_affiliate_id uuid, _amount numeric)
RETURNS public.withdrawals LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  aff public.affiliates;
  wd public.withdrawals;
BEGIN
  -- Validate affiliate exists and has sufficient pending balance
  SELECT * INTO aff
  FROM public.affiliates
  WHERE user_id = _affiliate_id;

  IF aff IS NULL THEN
    RAISE EXCEPTION 'Affiliate not found';
  END IF;

  IF _amount < 300 THEN
    RAISE EXCEPTION 'Minimum withdrawal is KSh 300';
  END IF;

  IF _amount > aff.pending_balance THEN
    RAISE EXCEPTION 'Insufficient pending balance';
  END IF;

  -- Create withdrawal request
  INSERT INTO public.withdrawals (affiliate_id, amount, status)
  VALUES (_affiliate_id, _amount, 'pending')
  RETURNING * INTO wd;

  -- Reserve the amount (move from pending to "committed")
  UPDATE public.affiliates
  SET pending_balance = pending_balance - _amount
  WHERE user_id = _affiliate_id;

  RETURN wd;
END; $$;

REVOKE ALL ON FUNCTION public.request_withdrawal(uuid, numeric) FROM public;
GRANT EXECUTE ON FUNCTION public.request_withdrawal(uuid, numeric) TO authenticated;

-- FUNCTION: Admin marks withdrawal as paid (with M-Pesa reference)
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

  SELECT * INTO wd
  FROM public.withdrawals
  WHERE id = _withdrawal_id;

  IF wd IS NULL THEN
    RAISE EXCEPTION 'Withdrawal not found';
  END IF;

  IF wd.status <> 'pending' THEN
    RAISE EXCEPTION 'Withdrawal already processed';
  END IF;

  IF _mpesa_reference IS NULL OR trim(_mpesa_reference) = '' THEN
    RAISE EXCEPTION 'M-Pesa reference required';
  END IF;

  -- Update withdrawal
  UPDATE public.withdrawals
  SET status = 'paid',
      mpesa_reference = trim(_mpesa_reference),
      processed_at = now(),
      processed_by = _admin_id
  WHERE id = _withdrawal_id
  RETURNING * INTO wd;

  -- Update affiliate total_withdrawn
  UPDATE public.affiliates
  SET total_withdrawn = total_withdrawn + wd.amount
  WHERE user_id = wd.affiliate_id;

  RETURN wd;
END; $$;

REVOKE ALL ON FUNCTION public.process_withdrawal(uuid, text, uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.process_withdrawal(uuid, text, uuid) TO authenticated;

-- FUNCTION: Admin rejects withdrawal (returns amount to pending_balance)
CREATE OR REPLACE FUNCTION public.reject_withdrawal(_withdrawal_id uuid, _admin_id uuid)
RETURNS public.withdrawals LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  wd public.withdrawals;
BEGIN
  IF NOT public.has_role(_admin_id, 'admin') THEN
    RAISE EXCEPTION 'Admin access required';
  END IF;

  SELECT * INTO wd
  FROM public.withdrawals
  WHERE id = _withdrawal_id;

  IF wd IS NULL THEN
    RAISE EXCEPTION 'Withdrawal not found';
  END IF;

  IF wd.status <> 'pending' THEN
    RAISE EXCEPTION 'Withdrawal already processed';
  END IF;

  UPDATE public.withdrawals
  SET status = 'rejected',
      processed_at = now(),
      processed_by = _admin_id
  WHERE id = _withdrawal_id
  RETURNING * INTO wd;

  -- Return amount to pending_balance
  UPDATE public.affiliates
  SET pending_balance = pending_balance + wd.amount
  WHERE user_id = wd.affiliate_id;

  RETURN wd;
END; $$;

REVOKE ALL ON FUNCTION public.reject_withdrawal(uuid, uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.reject_withdrawal(uuid, uuid) TO authenticated;

-- FUNCTION: Get affiliate dashboard data (for server function)
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
      'total_commissions_earned', a.total_commissions_earned,
      'total_withdrawn', a.total_withdrawn,
      'pending_balance', a.pending_balance
    ),
    'available_balance', (
      SELECT COALESCE(SUM(c.amount), 0)
      FROM public.commissions c
      WHERE c.affiliate_id = a.user_id AND c.status = 'available'
    ),
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

-- HELPER VIEW: Affiliate dashboard stats
CREATE OR REPLACE VIEW public.affiliate_dashboard AS
SELECT
  a.user_id,
  a.referral_code,
  a.status,
  a.total_referrals,
  a.total_commissions_earned,
  a.total_withdrawn,
  a.pending_balance,
  (
    SELECT COALESCE(SUM(c.amount), 0)
    FROM public.commissions c
    WHERE c.affiliate_id = a.user_id AND c.status = 'available'
  ) as available_balance,
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

-- RLS on view (uses underlying table RLS)
ALTER VIEW public.affiliate_dashboard SET (security_invoker = on);