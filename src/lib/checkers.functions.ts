import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { CHECKERS, checkerItem, type CheckerKind } from "@/lib/checkers";

const phone = z.string().trim().transform((s) => s.replace(/[\s-]/g, "")).pipe(z.string().regex(/^0\d{9}$/));

export const createCheckerOrder = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) =>
    z
      .object({
        kind: z.enum(["wassce", "bece", "novdec", "cssps"]),
        qty: z.number().int().min(1).max(20),
        recipient: phone,
        email: z.string().trim().email().max(160),
      })
      .parse(i),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const price = CHECKERS.find((c) => c.id === data.kind)!.price;
    const amount = price * data.qty;
    const reference = `WC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const { error } = await supabaseAdmin.from("orders").insert({
      reference,
      order_id: reference,
      recipient: data.recipient,
      item: checkerItem(data.kind as CheckerKind, data.qty),
      amount,
      currency: "GHS",
      country: "Ghana",
      customer_email: data.email.toLowerCase(),
      status: "Pending Payment",
      provider: "paystack",
    });
    if (error) throw new Error("Could not create order");
    return { reference, amount };
  });

export const getCheckerOrder = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => z.object({ reference: z.string().min(6).max(64) }).parse(i))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("status, item, amount")
      .eq("reference", data.reference)
      .maybeSingle();
    if (!order) return null;
    const { data: vouchers } = await supabaseAdmin
      .from("checker_vouchers")
      .select("serial, pin, kind")
      .eq("order_reference", data.reference);
    return { status: order.status, item: order.item, amount: Number(order.amount), vouchers: vouchers ?? [] };
  });

/** Requires phone + purchase email so nobody can read PINs with a phone number alone. */
export const retrieveCheckers = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) =>
    z.object({ recipient: phone, email: z.string().trim().email().max(160) }).parse(i),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("checker_vouchers")
      .select("serial, pin, kind, sold_at")
      .eq("recipient", data.recipient)
      .eq("email", data.email.toLowerCase())
      .order("sold_at", { ascending: false })
      .limit(50);
    if (error) throw new Error("Could not load checkers");
    return rows ?? [];
  });
