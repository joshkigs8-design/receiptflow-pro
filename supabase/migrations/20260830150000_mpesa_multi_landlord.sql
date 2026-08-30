-- Multi-Landlord M-Pesa Daraja STK Push Payment System Migration
-- Creates: landlord_mpesa_configs, mpesa_transactions

-- 1. LANDLORD M-PESA CONFIGURATIONS TABLE
-- Strictly accessible ONLY via backend service_role to prevent any direct client queries from reading raw secrets
CREATE TABLE IF NOT EXISTS public.landlord_mpesa_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  landlord_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  shortcode text NOT NULL,
  consumer_key text NOT NULL,
  consumer_secret text NOT NULL,
  passkey text NOT NULL,
  transaction_type text NOT NULL DEFAULT 'CustomerPayBillOnline' CHECK (transaction_type IN ('CustomerPayBillOnline', 'CustomerBuyGoodsOnline')),
  environment text NOT NULL DEFAULT 'sandbox' CHECK (environment IN ('sandbox', 'production')),
  account_reference_prefix text DEFAULT 'RRP',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (landlord_id)
);

COMMENT ON TABLE public.landlord_mpesa_configs IS 'Secure per-landlord Safaricom Daraja M-Pesa STK Push credentials (service_role only)';

-- 2. M-PESA TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.mpesa_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  landlord_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id uuid REFERENCES public.properties(id) ON DELETE SET NULL,
  unit_id uuid REFERENCES public.units(id) ON DELETE SET NULL,
  tenant_id uuid REFERENCES public.tenants(id) ON DELETE SET NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  phone_number text NOT NULL,
  account_reference text NOT NULL,
  transaction_description text DEFAULT 'Rent Payment',
  merchant_request_id text,
  checkout_request_id text UNIQUE,
  mpesa_receipt_number text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('initiated', 'pending', 'success', 'failed', 'cancelled', 'timeout', 'pending_reconciliation')),
  result_code integer,
  result_desc text,
  paid_at timestamptz,
  raw_callback jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.mpesa_transactions IS 'Complete lifecycle audit log of all Daraja STK Push payment attempts';

-- DATABASE CONSTRAINTS & INDICES
CREATE INDEX IF NOT EXISTS idx_mpesa_trans_checkout ON public.mpesa_transactions (checkout_request_id);
CREATE INDEX IF NOT EXISTS idx_mpesa_trans_receipt ON public.mpesa_transactions (mpesa_receipt_number);
CREATE INDEX IF NOT EXISTS idx_mpesa_trans_tenant ON public.mpesa_transactions (tenant_id);
CREATE INDEX IF NOT EXISTS idx_mpesa_trans_landlord ON public.mpesa_transactions (landlord_id);
CREATE INDEX IF NOT EXISTS idx_mpesa_trans_status ON public.mpesa_transactions (status);

-- Ensure M-Pesa receipt uniqueness across payments table
CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_mpesa_unique_ref 
  ON public.payments (reference) 
  WHERE method = 'mpesa' AND reference IS NOT NULL;

-- Ensure M-Pesa receipt uniqueness on successful mpesa_transactions
CREATE UNIQUE INDEX IF NOT EXISTS idx_mpesa_tx_unique_receipt 
  ON public.mpesa_transactions (mpesa_receipt_number) 
  WHERE status = 'success' AND mpesa_receipt_number IS NOT NULL;

-- STRICT LEAST-PRIVILEGE GRANTS
-- landlord_mpesa_configs: Revoke all public/authenticated access. Accessible strictly by service_role (backend server functions)
REVOKE ALL ON public.landlord_mpesa_configs FROM public, anon, authenticated;
GRANT ALL ON public.landlord_mpesa_configs TO service_role;

-- mpesa_transactions: Service role has full write access. Authenticated users can only read their own data via RLS.
REVOKE ALL ON public.mpesa_transactions FROM public, anon;
GRANT ALL ON public.mpesa_transactions TO service_role;
GRANT SELECT ON public.mpesa_transactions TO authenticated;

-- ENABLE RLS
ALTER TABLE public.landlord_mpesa_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mpesa_transactions ENABLE ROW LEVEL SECURITY;

-- POLICIES: mpesa_transactions (Landlord/Admin can inspect transactions)
CREATE POLICY "landlord own mpesa transactions read" ON public.mpesa_transactions
  FOR SELECT TO authenticated
  USING (landlord_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));


