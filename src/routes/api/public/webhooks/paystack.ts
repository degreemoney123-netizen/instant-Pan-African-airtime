import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";
import type { Json } from "@/integrations/supabase/types";

type PaystackEvent = {
  event?: string;
  data?: {
    reference?: string;
    status?: string;
    amount?: number;
    currency?: string;
    paid_at?: string;
    customer?: { email?: string };
  };
};

export const Route = createFileRoute("/api/public/webhooks/paystack")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["PAYSTACK_SECRET_KEY"];
        if (!secret) {
          console.error("PAYSTACK_SECRET_KEY is not configured");
          return new Response("Not configured", { status: 500 });
        }

        const raw = await request.text();
        const signature = request.headers.get("x-paystack-signature") ?? "";
        const expected = createHmac("sha512", secret).update(raw).digest("hex");

        const a = Buffer.from(signature);
        const b = Buffer.from(expected);
        if (a.length !== b.length || !timingSafeEqual(a, b)) {
          return new Response("Invalid signature", { status: 401 });
        }

        let payload: PaystackEvent;
        try {
          payload = JSON.parse(raw) as PaystackEvent;
        } catch {
          return new Response("Invalid payload", { status: 400 });
        }

        if (payload.event !== "charge.success" || payload.data?.status !== "success") {
          // Acknowledge everything else so Paystack stops retrying.
          return new Response("ignored", { status: 200 });
        }

        const reference = payload.data?.reference;
        if (!reference) return new Response("Missing reference", { status: 400 });

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const { data: order, error: findError } = await supabaseAdmin
          .from("orders")
          .select("id, status")
          .eq("reference", reference)
          .maybeSingle();

        if (findError) {
          console.error("Paystack webhook lookup failed", findError.message);
          return new Response("Lookup failed", { status: 500 });
        }
        if (!order) return new Response("Unknown reference", { status: 404 });
        if (order.status === "Paid & Processing" || order.status === "Delivered") {
          return new Response("ok", { status: 200 });
        }

        const { error: updateError } = await supabaseAdmin
          .from("orders")
          .update({
            status: "Paid & Processing",
            paid_at: payload.data?.paid_at ?? new Date().toISOString(),
            customer_email: payload.data?.customer?.email ?? null,
            provider_event: payload as unknown as Json,
          })
          .eq("id", order.id);

        if (updateError) {
          console.error("Paystack webhook update failed", updateError.message);
          return new Response("Update failed", { status: 500 });
        }

        return new Response("ok", { status: 200 });
      },
    },
  },
});
