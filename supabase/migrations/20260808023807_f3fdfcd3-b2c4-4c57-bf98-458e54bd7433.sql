CREATE TABLE public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  plan text NOT NULL DEFAULT 'trial',
  status text NOT NULL DEFAULT 'trialing',
  trial_ends_at timestamptz NOT NULL DEFAULT (now() + interval '2 months'),
  current_period_end timestamptz,
  last_reference text,
  last_amount numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own subscription read" ON public.subscriptions FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "own subscription insert" ON public.subscriptions FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE TRIGGER subscriptions_touch BEFORE UPDATE ON public.subscriptions
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.subscription_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reference text NOT NULL UNIQUE,
  plan text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'KES',
  status text NOT NULL DEFAULT 'pending',
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.subscription_payments TO authenticated;
GRANT ALL ON public.subscription_payments TO service_role;
ALTER TABLE public.subscription_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own subscription payments read" ON public.subscription_payments FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name, company_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
          COALESCE(NEW.raw_user_meta_data->>'company_name', 'Codevanta Ventures'))
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'landlord')
  ON CONFLICT (user_id, role) DO NOTHING;
  INSERT INTO public.subscriptions (user_id, plan, status, trial_ends_at)
  VALUES (NEW.id, 'trial', 'trialing', now() + interval '2 months')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END; $function$;

INSERT INTO public.subscriptions (user_id, plan, status, trial_ends_at)
SELECT id, 'trial', 'trialing', now() + interval '2 months' FROM auth.users
ON CONFLICT (user_id) DO NOTHING;