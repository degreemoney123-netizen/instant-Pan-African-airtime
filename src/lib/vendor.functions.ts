import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { COUNTRIES, bundlesFor } from "@/lib/fastdata";

const ghana = () => COUNTRIES.find((c) => c.code === "GH")!;

const newRef = (prefix: string) =>
  `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

/** Wallet balance, wallet history and the vendor's own orders. */
export const getVendorDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const [wallet, txs, orders] = await Promise.all([
      supabase.from("vendor_wallets").select("balance, currency").eq("user_id", userId).maybeSingle(),
      supabase
        .from("wallet_transactions")
        .select("reference, kind, amount, status, note, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(30),
      supabase
        .from("orders")
        .select("reference, order_id, recipient, item, amount, currency, status, provider, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(50),
    ]);
    if (wallet.error || txs.error || orders.error) throw new Error("Could not load dashboard");
    return {
      balance: Number(wallet.data?.balance ?? 0),
      currency: wallet.data?.currency ?? "GHS",
      transactions: txs.data ?? [],
      orders: orders.data ?? [],
    };
  });

/** Creates a pending top-up; the wallet is credited only when Paystack confirms payment. */
export const startWalletTopup = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ amount: z.number().min(5).max(20000) }).parse(i))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const reference = newRef("WT");
    const { error } = await supabaseAdmin.from("wallet_transactions").insert({
      user_id: context.userId,
      kind: "topup",
      amount: data.amount,
      reference,
      status: "Pending",
      note: "Wallet top-up via Paystack",
    });
    if (error) throw new Error("Could not start top-up");
    const email = (context.claims as { email?: string }).email ?? "vendor@fastdataafrica.com";
    return { reference, email };
  });

/** Buys a Ghana bundle from the wallet and sends it into DataHub fulfillment. */
export const buyWithWallet = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z
      .object({
        networkIndex: z.number().int().min(0).max(5),
        size: z.string().min(1).max(20),
        recipient: z.string().regex(/^0\d{9}$/, "Enter a 10-digit Ghana number"),
      })
      .parse(i),
  )
  .handler(async ({ data, context }) => {
    const country = ghana();
    const network = country.networks[data.networkIndex];
    const bundle = bundlesFor(country, data.networkIndex).find((b) => b.size === data.size);
    if (!network || !bundle) throw new Error("Unknown bundle");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const reference = newRef("VD");
    const item = `${network.name} ${bundle.size} Non-Expiry`;
    const { data: ok, error } = await supabaseAdmin.rpc("wallet_purchase", {
      _user_id: context.userId,
      _reference: reference,
      _order_id: reference.slice(3, 13),
      _recipient: data.recipient,
      _item: item,
      _amount: bundle.price,
    });
    if (error) throw new Error("Purchase failed");
    if (!ok) return { ok: false as const, message: "Insufficient wallet balance" };

    const { fulfillOrder } = await import("@/lib/fulfill.server");
    const result = await fulfillOrder(reference).catch(() => null);
    return {
      ok: true as const,
      reference,
      item,
      amount: bundle.price,
      status: result?.status ?? "Paid & Processing",
    };
  });
