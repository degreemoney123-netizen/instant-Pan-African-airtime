-- Allow anyone (including guests) to create a pending order.
-- Orders are only readable by their owner or via the unguessable payment reference,
-- so permitting inserts does not expose any customer data.
CREATE POLICY orders_insert_anyone
ON public.orders
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

GRANT INSERT ON public.orders TO anon, authenticated;