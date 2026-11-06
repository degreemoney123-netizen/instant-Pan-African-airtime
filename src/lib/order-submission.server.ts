import type { z } from "zod";
import { orderFailure, pendingOrderRow, type orderInputSchema, type OrderCreationResult } from "./order-submission";

export async function insertPendingOrder(data: z.infer<typeof orderInputSchema>, userId: string | null): Promise<OrderCreationResult> {
  const reference = `FD-${crypto.randomUUID()}`;
  if (!process.env["SUPABASE_URL"] || !process.env["SUPABASE_SERVICE_ROLE_KEY"]) {
    console.error("[Order creation] Private database configuration missing", {
      code: "ORDER_CONFIGURATION",
      missingUrl: !process.env["SUPABASE_URL"],
      missingServerCredential: !process.env["SUPABASE_SERVICE_ROLE_KEY"],
    });
    return orderFailure("ORDER_CONFIGURATION");
  }

  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const row = pendingOrderRow(data, reference, userId);
    const { error } = await supabaseAdmin.from("orders").insert(row);
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