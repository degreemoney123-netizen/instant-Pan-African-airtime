CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_roles_select_own ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE TABLE public.app_settings (
  key text PRIMARY KEY,
  value numeric NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.app_settings TO authenticated, anon;
GRANT UPDATE ON public.app_settings TO authenticated;
GRANT ALL ON public.app_settings TO service_role;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY app_settings_read ON public.app_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY app_settings_admin_update ON public.app_settings FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
INSERT INTO public.app_settings (key, value) VALUES ('referral_rate_percent', 2);

CREATE TABLE public.vendor_referrals (
  referred_id uuid PRIMARY KEY,
  referrer_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (referred_id <> referrer_id)
);
GRANT SELECT ON public.vendor_referrals TO authenticated;
GRANT ALL ON public.vendor_referrals TO service_role;
ALTER TABLE public.vendor_referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY vendor_referrals_select_own ON public.vendor_referrals FOR SELECT TO authenticated
  USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE OR REPLACE FUNCTION public.credit_referral_commission(_seller uuid, _reference text, _amount numeric)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE ref_id uuid; rate numeric; commission numeric;
BEGIN
  SELECT referrer_id INTO ref_id FROM public.vendor_referrals WHERE referred_id = _seller;
  IF ref_id IS NULL OR _amount <= 0 THEN RETURN; END IF;
  IF EXISTS (SELECT 1 FROM public.wallet_transactions WHERE reference = 'RC-' || _reference) THEN RETURN; END IF;
  SELECT value INTO rate FROM public.app_settings WHERE key = 'referral_rate_percent';
  commission := round(_amount * COALESCE(rate, 0) / 100, 2);
  IF commission <= 0 THEN RETURN; END IF;
  INSERT INTO public.vendor_wallets (user_id, balance) VALUES (ref_id, commission)
  ON CONFLICT (user_id) DO UPDATE SET balance = vendor_wallets.balance + EXCLUDED.balance, updated_at = now();
  INSERT INTO public.wallet_transactions (user_id, kind, amount, reference, status, note)
  VALUES (ref_id, 'referral', commission, 'RC-' || _reference, 'Completed',
          COALESCE(rate,0)::text || '% commission on agent sale ' || _reference);
END $$;
REVOKE EXECUTE ON FUNCTION public.credit_referral_commission(uuid, text, numeric) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.wallet_purchase(_user_id uuid, _reference text, _order_id text, _recipient text, _item text, _amount numeric)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.vendor_wallets SET balance = balance - _amount, updated_at = now()
  WHERE user_id = _user_id AND balance >= _amount;
  IF NOT FOUND THEN RETURN false; END IF;
  INSERT INTO public.wallet_transactions (user_id, kind, amount, reference, status, note)
  VALUES (_user_id, 'purchase', _amount, _reference, 'Completed', _item || ' → ' || _recipient);
  INSERT INTO public.orders (reference, order_id, recipient, item, amount, currency, country, status, provider, paid_at, user_id)
  VALUES (_reference, _order_id, _recipient, _item, _amount, 'GHS', 'Ghana', 'Paid & Processing', 'wallet', now(), _user_id);
  PERFORM public.credit_referral_commission(_user_id, _reference, _amount);
  RETURN true;
END $$;