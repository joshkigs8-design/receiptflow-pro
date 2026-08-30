-- Multi-Landlord M-Pesa Daraja STK Push Payment System Migration
-- Creates: landlord_mpesa_configs, mpesa_transactions

-- 1. LANDLORD M-PESA CONFIGURATIONS TABLE
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

COMMENT ON TABLE public.landlord_mpesa_configs IS 'Secure per-landlord Safaricom Daraja M-Pesa STK Push credentials';

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
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('initiated', 'pending', 'success', 'failed', 'cancelled', 'timeout')),
  result_code integer,
  result_desc text,
  paid_at timestamptz,
  raw_callback jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.mpesa_transactions IS 'Complete lifecycle audit log of all Daraja STK Push payment attempts';

-- INDICES
CREATE INDEX IF NOT EXISTS idx_mpesa_trans_checkout ON public.mpesa_transactions (checkout_request_id);
CREATE INDEX IF NOT EXISTS idx_mpesa_trans_receipt ON public.mpesa_transactions (mpesa_receipt_number);
CREATE INDEX IF NOT EXISTS idx_mpesa_trans_tenant ON public.mpesa_transactions (tenant_id);
CREATE INDEX IF NOT EXISTS idx_mpesa_trans_landlord ON public.mpesa_transactions (landlord_id);
CREATE INDEX IF NOT EXISTS idx_mpesa_trans_status ON public.mpesa_transactions (status);

-- GRANTS
GRANT ALL ON public.landlord_mpesa_configs TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.landlord_mpesa_configs TO authenticated;

GRANT ALL ON public.mpesa_transactions TO service_role;
GRANT SELECT, INSERT, UPDATE ON public.mpesa_transactions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.mpesa_transactions TO anon;

-- ENABLE RLS
ALTER TABLE public.landlord_mpesa_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mpesa_transactions ENABLE ROW LEVEL SECURITY;

-- POLICIES: landlord_mpesa_configs
CREATE POLICY "landlord own mpesa config read" ON public.landlord_mpesa_configs
  FOR SELECT TO authenticated
  USING (landlord_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "landlord own mpesa config insert" ON public.landlord_mpesa_configs
  FOR INSERT TO authenticated
  WITH CHECK (landlord_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "landlord own mpesa config update" ON public.landlord_mpesa_configs
  FOR UPDATE TO authenticated
  USING (landlord_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- POLICIES: mpesa_transactions
CREATE POLICY "landlord own mpesa transactions read" ON public.mpesa_transactions
  FOR SELECT TO authenticated
  USING (landlord_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

