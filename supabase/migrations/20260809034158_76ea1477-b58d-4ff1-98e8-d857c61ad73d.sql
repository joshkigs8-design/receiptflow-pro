-- 1. Trial: 1 month
ALTER TABLE public.subscriptions ALTER COLUMN trial_ends_at SET DEFAULT (now() + interval '1 month');

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
  VALUES (NEW.id, 'trial', 'trialing', now() + interval '1 month')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END; $function$;

-- 2. Owner admin role
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users WHERE lower(email) = 'joshkigs8@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

CREATE OR REPLACE FUNCTION public.grant_owner_admin()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.email_confirmed_at IS NOT NULL AND lower(NEW.email) = 'joshkigs8@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS on_auth_user_created_owner_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_owner_admin
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.grant_owner_admin();

DROP TRIGGER IF EXISTS on_auth_user_confirmed_owner_admin ON auth.users;
CREATE TRIGGER on_auth_user_confirmed_owner_admin
AFTER UPDATE OF email_confirmed_at ON auth.users
FOR EACH ROW WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
EXECUTE FUNCTION public.grant_owner_admin();

-- 3. Vouchers
CREATE TABLE public.vouchers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  months integer NOT NULL DEFAULT 1,
  max_uses integer NOT NULL DEFAULT 1,
  used_count integer NOT NULL DEFAULT 0,
  expires_at timestamptz,
  note text,
  active boolean NOT NULL DEFAULT true,
  created_by uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.vouchers TO authenticated;
GRANT ALL ON public.vouchers TO service_role;
ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins manage vouchers" ON public.vouchers
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER vouchers_touch BEFORE UPDATE ON public.vouchers
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.voucher_redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  voucher_id uuid NOT NULL REFERENCES public.vouchers(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  months integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (voucher_id, user_id)
);

GRANT SELECT ON public.voucher_redemptions TO authenticated;
GRANT ALL ON public.voucher_redemptions TO service_role;
ALTER TABLE public.voucher_redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own or admin redemptions read" ON public.voucher_redemptions
FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- 4. Admins can update subscriptions
CREATE POLICY "admins update subscriptions" ON public.subscriptions
FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 5. Redeem function
CREATE OR REPLACE FUNCTION public.redeem_voucher(_code text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v public.vouchers;
  uid uuid := auth.uid();
  base timestamptz;
  new_end timestamptz;
BEGIN
  IF uid IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'message', 'Not signed in');
  END IF;

  SELECT * INTO v FROM public.vouchers
  WHERE lower(code) = lower(btrim(_code)) FOR UPDATE;

  IF v.id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'message', 'Invalid voucher code');
  END IF;
  IF NOT v.active THEN
    RETURN jsonb_build_object('ok', false, 'message', 'This voucher is no longer active');
  END IF;
  IF v.expires_at IS NOT NULL AND v.expires_at < now() THEN
    RETURN jsonb_build_object('ok', false, 'message', 'This voucher has expired');
  END IF;
  IF v.used_count >= v.max_uses THEN
    RETURN jsonb_build_object('ok', false, 'message', 'This voucher has been fully used');
  END IF;
  IF EXISTS (SELECT 1 FROM public.voucher_redemptions r WHERE r.voucher_id = v.id AND r.user_id = uid) THEN
    RETURN jsonb_build_object('ok', false, 'message', 'You already used this voucher');
  END IF;

  INSERT INTO public.subscriptions (user_id) VALUES (uid) ON CONFLICT (user_id) DO NOTHING;

  SELECT GREATEST(COALESCE(current_period_end, now()), COALESCE(trial_ends_at, now()), now())
  INTO base FROM public.subscriptions WHERE user_id = uid;

  new_end := base + (v.months || ' months')::interval;

  UPDATE public.subscriptions
  SET status = 'active', plan = 'voucher', current_period_end = new_end,
      last_reference = 'voucher:' || v.code
  WHERE user_id = uid;

  INSERT INTO public.voucher_redemptions (voucher_id, user_id, months)
  VALUES (v.id, uid, v.months);

  UPDATE public.vouchers SET used_count = used_count + 1 WHERE id = v.id;

  RETURN jsonb_build_object('ok', true, 'months', v.months, 'ends_at', new_end);
END; $$;

REVOKE ALL ON FUNCTION public.redeem_voucher(text) FROM public;
GRANT EXECUTE ON FUNCTION public.redeem_voucher(text) TO authenticated;