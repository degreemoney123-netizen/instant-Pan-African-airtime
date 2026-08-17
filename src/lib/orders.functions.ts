import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const createSchema = z.object({
  orderId: z.string().min(3).max(40),
  recipient: z.string().min(6).max(20),
  item: z.string().min(1).max(120),
  amount: z.number().positive().max(10_000_000),
  currency: z.string().min(2).max(8),
  country: z.string().min(1).max(80),
  email: z.string().email().max(160).optional(),
});

/** Creates a pending order and returns the Paystack payment reference. */
export const createPendingOrder = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => createSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const reference = `FD-${Date.now().toString(36).toUpperCase()}-${Math.random()
      .toString(36)
      .slice(2, 8)
      .toUpperCase()}`;

    const { error } = await supabaseAdmin.from("orders").insert({
      reference,
      order_id: data.orderId,
      recipient: data.recipient,
      item: data.item,
      amount: data.amount,
      currency: data.currency,
      country: data.country,
      customer_email: data.email ?? null,
      status: "Pending Payment",
    });

    if (error) throw new Error("Could not create order");
    return { reference };
  });

/** Public status lookup by unguessable payment reference. */
export const getOrderByReference = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ reference: z.string().min(6).max(64) }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: row, error } = await supabaseAdmin
      .from("orders")
      .select("reference, order_id, item, amount, currency, country, status, paid_at, created_at, recipient")
      .eq("reference", data.reference)
      .maybeSingle();

    if (error) throw new Error("Could not load order");
    if (!row) return null;

    // Mask the recipient number so the shareable link never exposes it fully.
    const masked = row.recipient.replace(/^(\d{3})\d+(\d{2})$/, "$1•••••$2");
    return { ...row, recipient: masked };
  });

/** Order history for a recipient number, used by the public order tracker. */
export const getOrdersByRecipient = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ recipient: z.string().min(6).max(20) }).parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: rows, error } = await supabaseAdmin
      .from("orders")
      .select("reference, order_id, item, amount, currency, country, status, paid_at, created_at")
      .eq("recipient", data.recipient)
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) throw new Error("Could not load orders");
    return rows ?? [];
  });
