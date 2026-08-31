-- Multi-Provider Payment System Migration: KCB BUNI Integration
-- Adds: landlord_kcb_configs, kcb_transactions, and updates payments table indexes

-- 1. LANDLORD KCB CONFIGURATIONS TABLE
-- Strictly accessible ONLY via backend service_role to prevent any direct client queries from reading raw secrets
CREATE TABLE IF NOT EXISTS public.landlord_kcb_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  landlord_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  paybill_number text NOT NULL,
  account_number text,
  client_key text NOT NULL,
  client_secret text NOT NULL,
  ipn_secret_token text,
  environment text NOT NULL DEFAULT 'sandbox' CHECK (environment IN ('sandbox', 'production')),
  account_reference_prefix text DEFAULT 'RR',
  is_active boolean NOT NULL DEFAULT true,
  connection_status text NOT NULL DEFAULT 'configured' CHECK (connection_status IN ('not_configured', 'configured', 'connection_successful', 'connection_failed', 'awaiting_approval')),
  last_tested_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (landlord_id)
);

COMMENT ON TABLE public.landlord_kcb_configs IS 'Secure per-landlord KCB BUNI API credentials (service_role only)';

-- 2. KCB TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.kcb_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  landlord_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id uuid REFERENCES public.properties(id) ON DELETE SET NULL,
  unit_id uuid REFERENCES public.units(id) ON DELETE SET NULL,
  tenant_id uuid REFERENCES public.tenants(id) ON DELETE SET NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  phone_number text,
  customer_name text,
  account_reference text NOT NULL,
  kcb_transaction_id text NOT NULL UNIQUE,
  merchant_id text,
  channel text NOT NULL DEFAULT 'KCB_BUNI',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('initiated', 'pending', 'success', 'failed', 'cancelled', 'duplicate', 'pending_reconciliation')),
  result_code text,
  result_desc text,
  paid_at timestamptz,
  raw_ipn jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.kcb_transactions IS 'Complete lifecycle audit log of all KCB BUNI IPN notifications and payment attempts';

-- DATABASE CONSTRAINTS & INDICES FOR IDEMPOTENCY
CREATE INDEX IF NOT EXISTS idx_kcb_trans_txid ON public.kcb_transactions (kcb_transaction_id);
CREATE INDEX IF NOT EXISTS idx_kcb_trans_ref ON public.kcb_transactions (account_reference);
CREATE INDEX IF NOT EXISTS idx_kcb_trans_tenant ON public.kcb_transactions (tenant_id);
CREATE INDEX IF NOT EXISTS idx_kcb_trans_landlord ON public.kcb_transactions (landlord_id);
CREATE INDEX IF NOT EXISTS idx_kcb_trans_status ON public.kcb_transactions (status);

-- Ensure KCB transaction ID uniqueness across payments table
CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_kcb_unique_ref 
  ON public.payments (reference) 
  WHERE method IN ('kcb', 'kcb_buni') AND reference IS NOT NULL;

-- STRICT LEAST-PRIVILEGE GRANTS
-- landlord_kcb_configs: Revoke all public/authenticated access. Accessible strictly by service_role (backend server functions)
REVOKE ALL ON public.landlord_kcb_configs FROM public, anon, authenticated;
GRANT ALL ON public.landlord_kcb_configs TO service_role;

-- kcb_transactions: Service role has full write access. Authenticated users can only read their own data via RLS.
REVOKE ALL ON public.kcb_transactions FROM public, anon;
GRANT ALL ON public.kcb_transactions TO service_role;
GRANT SELECT ON public.kcb_transactions TO authenticated;

-- ENABLE RLS
ALTER TABLE public.landlord_kcb_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kcb_transactions ENABLE ROW LEVEL SECURITY;

-- POLICIES: kcb_transactions (Landlord/Admin can inspect transactions)
CREATE POLICY "landlord own kcb transactions read" ON public.kcb_transactions
  FOR SELECT TO authenticated
  USING (landlord_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

