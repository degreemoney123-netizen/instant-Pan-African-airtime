CREATE TABLE public.checker_vouchers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL,
  serial text NOT NULL,
  pin text NOT NULL,
  status text NOT NULL DEFAULT 'available',
  order_reference text,
  recipient text,
  email text,
  sold_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (kind, serial)
);
CREATE INDEX checker_vouchers_recipient_idx ON public.checker_vouchers(recipient);
CREATE INDEX checker_vouchers_ref_idx ON public.checker_vouchers(order_reference);
GRANT ALL ON public.checker_vouchers TO service_role;
ALTER TABLE public.checker_vouchers ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.assign_checkers(_reference text, _kind text, _qty int, _recipient text, _email text)
RETURNS int LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE have int; n int;
BEGIN
  SELECT count(*) INTO have FROM public.checker_vouchers WHERE order_reference = _reference;
  IF have >= _qty THEN RETURN have; END IF;
  WITH picked AS (
    SELECT id FROM public.checker_vouchers WHERE kind = _kind AND status = 'available'
    ORDER BY created_at LIMIT (_qty - have) FOR UPDATE SKIP LOCKED
  )
  UPDATE public.checker_vouchers v SET status = 'sold', order_reference = _reference,
    recipient = _recipient, email = _email, sold_at = now()
  FROM picked WHERE v.id = picked.id;
  GET DIAGNOSTICS n = ROW_COUNT;
  RETURN have + n;
END $$;
REVOKE ALL ON FUNCTION public.assign_checkers(text,text,int,text,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.assign_checkers(text,text,int,text,text) TO service_role;