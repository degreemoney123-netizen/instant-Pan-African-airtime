import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

function makeReferralCode(userId: string): string {
  return `FD${userId.replace(/-/g, "").slice(0, 6).toUpperCase()}`;
}

export type AccountSummary = {
  profile: {
    id: string;
    email: string | null;
    full_name: string | null;
    phone: string | null;
    points: number;
    referral_code: string | null;
  };
  orders: Array<{
    reference: string;
    order_id: string;
    item: string;
    amount: number;
    currency: string;
    country: string;
    status: string;
    created_at: string;
  }>;
  recipients: Array<{ id: string; label: string; number: string; network: string }>;
  loyalty: Array<{ id: string; points: number; reason: string; created_at: string }>;
};

/** Profile, points, saved numbers and order history for the signed-in customer. */
export const getMyAccount = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AccountSummary> => {
    const { supabase, userId, claims } = context;

    const email = typeof claims["email"] === "string" ? (claims["email"] as string) : null;

    // Create the profile row on first visit (no auth-schema triggers used).
    const { data: existing } = await supabase
      .from("profiles")
      .select("id, email, full_name, phone, points, referral_code")
      .eq("id", userId)
      .maybeSingle();

    let profile = existing;
    if (!profile) {
      const { data: created, error } = await supabase
        .from("profiles")
        .insert({ id: userId, email, referral_code: makeReferralCode(userId) })
        .select("id, email, full_name, phone, points, referral_code")
        .single();
      if (error) throw new Error("Could not set up your account");
      profile = created;
    }

    const [orders, recipients, loyalty] = await Promise.all([
      supabase
        .from("orders")
        .select("reference, order_id, item, amount, currency, country, status, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(25),
      supabase
        .from("saved_recipients")
        .select("id, label, number, network")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
      supabase
        .from("loyalty_ledger")
        .select("id, points, reason, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20),
    ]);

    return {
      profile,
      orders: orders.data ?? [],
      recipients: recipients.data ?? [],
      loyalty: loyalty.data ?? [],
    };
  });

/** Updates the signed-in customer's name and phone. */
export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({ fullName: z.string().max(80).optional(), phone: z.string().max(20).optional() })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("profiles")
      .update({ full_name: data.fullName ?? null, phone: data.phone ?? null })
      .eq("id", context.userId);
    if (error) throw new Error("Could not save your details");
    return { ok: true };
  });

/** Saves a recipient number to the signed-in customer's account. */
export const saveMyRecipient = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        label: z.string().min(1).max(40),
        number: z.string().min(6).max(20),
        network: z.string().min(1).max(30),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("saved_recipients")
      .insert({ ...data, user_id: context.userId });
    if (error) throw new Error("Could not save this number");
    return { ok: true };
  });

/** Removes one of the signed-in customer's saved numbers. */
export const deleteMyRecipient = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("saved_recipients")
      .delete()
      .eq("id", data.id)
      .eq("user_id", context.userId);
    if (error) throw new Error("Could not remove this number");
    return { ok: true };
  });
