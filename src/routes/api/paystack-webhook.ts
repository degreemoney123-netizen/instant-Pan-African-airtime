import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";
import type { Json } from "@/integrations/supabase/types";

type Meta = { recipient_phone?: string; network?: string; plan_id?: string };
type PaystackEvent = {
  event?: string;
  data?: { reference?: string; status?: string; metadata?: Meta | string };
};

const DATAHUB_RELOAD_URL = "https://app.datahubgh.com/api/v1/reload";

export const Route = createFileRoute("/api/paystack-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["PAYSTACK_SECRET_KEY"];
        if (!secret) return new Response("Not configured", { status: 500 });

        const raw = await request.text();
        const signature = request.headers.get("x-paystack-signature") ?? "";
        const expected = createHmac("sha512", secret).update(raw).digest("hex");
        const a = Buffer.from(signature);
        const b = Buffer.from(expected);
        if (a.length !== b.length || !timingSafeEqual(a, b)) {
          return new Response("Unauthorized", { status: 401 });
        }

        let event: PaystackEvent;
        try {
          event = JSON.parse(raw) as PaystackEvent;
        } catch {
          return new Response("Invalid payload", { status: 400 });
        }
        if (event.event !== "charge.success") return new Response("ok", { status: 200 });

        const reference = event.data?.reference;
        let meta: Meta = {};
        const m = event.data?.metadata;
        if (typeof m === "string") {
          try { meta = JSON.parse(m) as Meta; } catch { /* ignore */ }
        } else if (m) meta = m;
        const { recipient_phone, network, plan_id } = meta;
        if (!reference || !recipient_phone || !network || !plan_id) {
          console.error("paystack-webhook: missing metadata", reference);
          return new Response("ok", { status: 200 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        // Idempotency: Paystack retries webhooks — never top up the same order twice.
        const { data: order } = await supabaseAdmin
          .from("orders").select("id, status").eq("reference", reference).maybeSingle();
        if (order?.status === "Delivered") return new Response("ok", { status: 200 });

        const apiKey = process.env["DATAHUB_API_KEY"];
        let delivered = false;
        let detail = "";
        if (!apiKey) {
          detail = "DATAHUB_API_KEY not configured";
        } else {
          try {
            const res = await fetch(DATAHUB_RELOAD_URL, {
              method: "POST",
              headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
              body: JSON.stringify({ network, recipient: recipient_phone, plan: plan_id, reference }),
            });
            delivered = res.ok;
            detail = res.ok ? "Delivered via DataHub reload" : `DataHub reload HTTP ${res.status}`;
          } catch (e) {
            detail = `DataHub unreachable: ${e instanceof Error ? e.message : "error"}`;
          }
        }

        if (order) {
          await supabaseAdmin.from("orders").update({
            status: delivered ? "Delivered" : "Pending/Failed",
            paid_at: new Date().toISOString(),
            provider_event: { fulfillment: detail, needs_manual_retry: !delivered } as unknown as Json,
          }).eq("id", order.id);
        }
        if (!delivered) console.error(`[ADMIN ALERT] reload failed for ${reference}: ${detail}`);

        return new Response("ok", { status: 200 });
      },
    },
  },
});
