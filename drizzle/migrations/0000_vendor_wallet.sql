CREATE TABLE public.vendor_wallets (
  user_id uuid PRIMARY KEY,
  balance numeric NOT NULL DEFAULT 0 CHECK (balance >= 0),
  currency text NOT NULL DEFAULT 'GHS',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.vendor_wallets TO authenticated;
GRANT ALL ON public.vendor_wallets TO service_role;
ALTER TABLE public.vendor_wallets ENABLE ROW LEVEL SECURITY;
CREATE POLICY vendor_wallets_select_own ON public.vendor_wallets FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.wallet_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  kind text NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  reference text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'Pending',
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.wallet_transactions TO authenticated;
GRANT ALL ON public.wallet_transactions TO service_role;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY wallet_tx_select_own ON public.wallet_transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE INDEX wallet_tx_user_idx ON public.wallet_transactions(user_id, created_at DESC);

-- Credits a pending top-up once (called by the payment webhook).
CREATE OR REPLACE FUNCTION public.complete_wallet_topup(_reference text, _amount numeric)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE tx public.wallet_transactions;
BEGIN
  SELECT * INTO tx FROM public.wallet_transactions WHERE reference = _reference AND kind = 'topup' FOR UPDATE;
  IF NOT FOUND OR tx.status = 'Completed' THEN RETURN false; END IF;
  IF _amount < tx.amount THEN RETURN false; END IF;
  UPDATE public.wallet_transactions SET status = 'Completed' WHERE id = tx.id;
  INSERT INTO public.vendor_wallets (user_id, balance) VALUES (tx.user_id, tx.amount)
  ON CONFLICT (user_id) DO UPDATE SET balance = vendor_wallets.balance + EXCLUDED.balance, updated_at = now();
  RETURN true;
END $$;

-- Atomically debits the wallet and creates a paid order.
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
  RETURN true;
END $$;

REVOKE EXECUTE ON FUNCTION public.complete_wallet_topup(text, numeric) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.wallet_purchase(uuid, text, text, text, text, numeric) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.complete_wallet_topup(text, numeric) TO service_role;
GRANT EXECUTE ON FUNCTION public.wallet_purchase(uuid, text, text, text, text, numeric) TO service_role;