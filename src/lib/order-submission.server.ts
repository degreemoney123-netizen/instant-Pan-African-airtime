import type { z } from "zod";
import { orderFailure, pendingOrderRow, type orderInputSchema, type OrderCreationResult } from "./order-submission";

export async function insertPendingOrder(data: z.infer<typeof orderInputSchema>, userId: string | null): Promise<OrderCreationResult> {
  const reference = `FD-${crypto.randomUUID()}`;
  if (!process.env["SUPABASE_URL"] || !process.env["SUPABASE_PUBLISHABLE_KEY"]) {
    console.error("[Order creation] Public database configuration missing", {
      code: "ORDER_CONFIGURATION",
      missingUrl: !process.env["SUPABASE_URL"],
      missingPublishableKey: !process.env["SUPABASE_PUBLISHABLE_KEY"],
    });
    return orderFailure("ORDER_CONFIGURATION");
  }

  try {
    // Uses the publishable key with the orders_insert_anyone RLS policy, so order
    // creation works on any deployment (Lovable, Vercel) without private keys.
    const { supabase } = await import("@/integrations/supabase/client");
    const row = pendingOrderRow(data, reference, userId);
    const { error } = await supabase.from("orders").insert(row);
    if (error) {
      // Keep database diagnostics on the server; never log the customer payload.
      const redact = (value: string | null) => {
        let text = value ?? "";
        for (const field of [data.recipient, data.email, userId]) {
          if (field) text = text.split(field).join("[redacted]");
        }
        return text;
      };
      console.error("[Order creation] Database insert failed", {
        reference, code: error.code,
        message: redact(error.message), details: redact(error.details), hint: redact(error.hint),
      });
      return orderFailure(error.code || "ORDER_INSERT_FAILED");
    }
    return { reference, error: null };
  } catch {
    console.error("[Order creation] Database request failed", { reference, code: "ORDER_CONNECTION_FAILED" });
    return orderFailure("ORDER_CONNECTION_FAILED");
  }
}
