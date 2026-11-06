import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

export const orderInputSchema = z.object({
  orderId: z.string().trim().min(3).max(40),
  recipient: z.string().trim().transform((value) => value.replace(/[\s()-]/g, "")).pipe(z.string().regex(/^\+?\d{6,15}$/, "Enter a valid recipient phone number")),
  item: z.string().trim().min(1).max(120),
  amount: z.number().positive().max(10_000_000),
  currency: z.string().trim().min(2).max(8),
  country: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(160).optional(),
});

export function pendingOrderRow(input: z.infer<typeof orderInputSchema>, reference: string, userId: string | null): Database["public"]["Tables"]["orders"]["Insert"] {
  return {
    reference,
    order_id: input.orderId,
    // The existing schema calls the phone field recipient, not phone_number.
    recipient: input.recipient,
    item: input.item,
    amount: input.amount,
    currency: input.currency,
    country: input.country,
    customer_email: input.email ?? null,
    user_id: userId,
    status: "Pending Payment",
    provider: "paystack",
  };
}

export type OrderCreationResult =
  | { reference: string; error: null }
  | { reference: null; error: { code: string; message: string } };

export function orderFailure(code: string): OrderCreationResult {
  const message = code === "ORDER_CONFIGURATION"
    ? "Order checkout is temporarily unavailable because the site's private connection settings are missing. Please contact support."
    : code === "42501" || code === "PGRST301"
      ? "Order saving was denied. Please contact support and quote the error code."
      : "We could not save your order. Please try again or contact support with the error code.";
  return { reference: null, error: { code, message } };
}