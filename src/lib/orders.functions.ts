import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { orderInputSchema, orderFailure } from "@/lib/order-submission";

const createSchema = orderInputSchema;

/** Creates a pending order and returns the Paystack payment reference. */
export const createPendingOrder = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => createSchema.parse(input))
  .handler(async ({ data }) => {
    const { getRequest } = await import("@tanstack/react-start/server");
    const { insertPendingOrder } = await import("@/lib/order-submission.server");
    const authorization = getRequest().headers.get("authorization");
    let userId: string | null = null;
    if (authorization) {
      if (!authorization.startsWith("Bearer ")) return orderFailure("ORDER_AUTH_FAILED");
      // Verify the caller's token with the publishable client so this works on
      // any deployment without private keys.
      const { supabase } = await import("@/integrations/supabase/client");
      const { data: auth, error } = await supabase.auth.getUser(authorization.slice(7));
      if (error || !auth.user) return orderFailure("ORDER_AUTH_FAILED");
      userId = auth.user.id;
    }
    return insertPendingOrder(data, userId);
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

/** Same as createPendingOrder, but attaches the order to the signed-in customer. */
export const createMyPendingOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => createSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { insertPendingOrder } = await import("@/lib/order-submission.server");
    return insertPendingOrder(data, context.userId);
  });
