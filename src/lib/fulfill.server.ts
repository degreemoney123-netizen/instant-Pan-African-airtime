import type { Json } from "@/integrations/supabase/types";

export const FAILED_STATUS = "Pending/Failed";

async function markFailed(id: string, reference: string, detail: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  await supabaseAdmin
    .from("orders")
    .update({
      status: FAILED_STATUS,
      provider_event: { fulfillment: detail, needs_manual_retry: true, failed_at: new Date().toISOString() } as unknown as Json,
    })
    .eq("id", id);
  // Admin alert: surfaces in server logs; order stays flagged for manual retry.
  console.error(`[ADMIN ALERT] DataHub fulfillment failed for ${reference}: ${detail}`);
}

const DATAHUB_URL = "https://app.datahubgh.com/api/v1/topup";

export interface FulfillResult {
  reference: string;
  status: string;
  simulated: boolean;
  detail?: string;
}

/**
 * Delivers a paid order through the DataHub GH top-up API and marks it
 * "Delivered". When DATAHUB_API_KEY is absent (local builder testing),
 * simulates a successful delivery after a 2s delay so UI flows can be tested.
 */
export async function fulfillOrder(reference: string): Promise<FulfillResult> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data: order, error } = await supabaseAdmin
    .from("orders")
    .select("id, reference, recipient, item, status")
    .eq("reference", reference)
    .maybeSingle();

  if (error) throw new Error("Order lookup failed");
  if (!order) return { reference, status: "Not Found", simulated: false };
  if (order.status === "Delivered") {
    return { reference, status: "Delivered", simulated: false };
  }
  if (order.status !== "Paid & Processing" && order.status !== FAILED_STATUS) {
    return { reference, status: order.status, simulated: false, detail: "Order is not paid yet" };
  }

  // Item looks like "MTN 5GB Non-Expiry" — network is the first token,
  // package id is a slug of the full item name.
  const network = order.item.split(" ")[0]?.toUpperCase() ?? "MTN";
  const packageId = order.item.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const apiKey = process.env["DATAHUB_API_KEY"];
  let detail: string | undefined;
  let simulated = false;

  if (!apiKey) {
    // Test mode: simulate a successful delivery after 2 seconds.
    await new Promise((resolve) => setTimeout(resolve, 2000));
    simulated = true;
    detail = "Simulated delivery (no DATAHUB_API_KEY configured)";
  } else {
    let res: Response;
    try {
    res = await fetch(DATAHUB_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        network,
        recipient_number: order.recipient,
        package_id: packageId,
        reference: order.reference,
      }),
    });
    } catch (e) {
      const msg = `DataHub unreachable: ${e instanceof Error ? e.message : "network error"}`;
      await markFailed(order.id, reference, msg);
      return { reference, status: FAILED_STATUS, simulated: false, detail: msg };
    }

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("DataHub topup failed", res.status, text.slice(0, 300));
      const msg = `DataHub rejected the top-up (HTTP ${res.status})`;
      await markFailed(order.id, reference, msg);
      return { reference, status: FAILED_STATUS, simulated: false, detail: msg };
    }
    detail = "Delivered via DataHub GH";
  }

  const { error: updateError } = await supabaseAdmin
    .from("orders")
    .update({ status: "Delivered", provider_event: { fulfillment: detail } as unknown as Json })
    .eq("id", order.id);

  if (updateError) {
    console.error("Fulfillment status update failed", updateError.message);
    throw new Error("Could not update order status");
  }

  return { reference, status: "Delivered", simulated, detail };
}
