import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const makeCode = () => `FDV-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

/** The vendor's referral code, rate, referred agents and commission earned. */
export const getReferralInfo = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: profile } = await supabaseAdmin
      .from("profiles").select("referral_code").eq("id", userId).maybeSingle();
    let code = profile?.referral_code ?? null;
    if (!code) {
      code = makeCode();
      await supabaseAdmin.from("profiles").upsert({ id: userId, referral_code: code });
    }

    const [rate, refs, commissions, roles] = await Promise.all([
      supabase.from("app_settings").select("value").eq("key", "referral_rate_percent").maybeSingle(),
      supabase.from("vendor_referrals").select("referred_id, referrer_id, created_at"),
      supabase.from("wallet_transactions").select("amount").eq("user_id", userId).eq("kind", "referral"),
      supabase.from("user_roles").select("role").eq("user_id", userId),
    ]);
    const rows = refs.data ?? [];
    const myAgents = rows.filter((r) => r.referrer_id === userId);
    return {
      code,
      ratePercent: Number(rate.data?.value ?? 0),
      agentsReferred: myAgents.length,
      referredBy: rows.some((r) => r.referred_id === userId),
      earned: (commissions.data ?? []).reduce((s, t) => s + Number(t.amount), 0),
      isAdmin: (roles.data ?? []).some((r) => r.role === "admin"),
    };
  });

/** Links the signed-in vendor to the vendor who referred them (once only). */
export const claimReferral = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ code: z.string().trim().min(4).max(20) }).parse(i))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: owner } = await supabaseAdmin
      .from("profiles").select("id").eq("referral_code", data.code.toUpperCase()).maybeSingle();
    if (!owner) return { ok: false as const, message: "That referral code doesn't exist" };
    if (owner.id === context.userId) return { ok: false as const, message: "You can't use your own code" };
    const { error } = await supabaseAdmin
      .from("vendor_referrals").insert({ referred_id: context.userId, referrer_id: owner.id });
    if (error) return { ok: false as const, message: "You're already linked to a referrer" };
    return { ok: true as const };
  });

/** Admin only: change the referral commission percentage. */
export const setReferralRate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ percent: z.number().min(0).max(50) }).parse(i))
  .handler(async ({ data, context }) => {
    // RLS only lets admins update this row.
    const { data: rows, error } = await context.supabase
      .from("app_settings")
      .update({ value: data.percent, updated_at: new Date().toISOString() })
      .eq("key", "referral_rate_percent")
      .select("value");
    if (error || !rows?.length) throw new Error("Only admins can change the commission rate");
    return { percent: Number(rows[0]!.value) };
  });
