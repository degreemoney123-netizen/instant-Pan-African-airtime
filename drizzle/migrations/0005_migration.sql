-- Public checkout: create a pending order through a security-definer function so
-- guest checkouts work on every deployment without relying on table-level INSERT policies.
CREATE OR REPLACE FUNCTION public.create_pending_order(
  p_reference text,
  p_order_id text,
  p_recipient text,
  p_item text,
  p_amount numeric,
  p_currency text,
  p_country text,
  p_customer_email text DEFAULT NULL,
  p_user_id uuid DEFAULT NULL
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_reference IS NULL OR length(p_reference) < 6 OR length(p_reference) > 64 THEN
    RAISE EXCEPTION 'invalid reference';
  END IF;
  IF p_recipient IS NULL OR p_recipient !~ '^\+?[0-9]{6,15}$' THEN
    RAISE EXCEPTION 'invalid recipient';
  END IF;
  IF p_amount IS NULL OR p_amount <= 0 OR p_amount > 10000000 THEN
    RAISE EXCEPTION 'invalid amount';
  END IF;
  IF p_item IS NULL OR length(p_item) > 120 THEN
    RAISE EXCEPTION 'invalid item';
  END IF;

  INSERT INTO public.orders (
    reference, order_id, recipient, item, amount, currency, country,
    customer_email, user_id, status, provider
  ) VALUES (
    p_reference, p_order_id, p_recipient, p_item, p_amount, p_currency, p_country,
    p_customer_email, p_user_id, 'Pending Payment', 'paystack'
  );
  RETURN p_reference;
END;
$$;

REVOKE ALL ON FUNCTION public.create_pending_order(text, text, text, text, numeric, text, text, text, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_pending_order(text, text, text, text, numeric, text, text, text, uuid) TO anon, authenticated, service_role;