import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/useAuth";
import {
  deleteMyRecipient,
  getMyAccount,
  saveMyRecipient,
  updateMyProfile,
} from "@/lib/account.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/account")({
  component: AccountPage,
  head: () => ({
    meta: [
      { title: "My account — orders, saved numbers & points" },
      {
        name: "description",
        content:
          "View your FastData Africa order history, manage saved recipient numbers and track the loyalty points you earn on every data bundle.",
      },
      { property: "og:title", content: "My FastData Africa account" },
      {
        property: "og:description",
        content: "Order history, saved numbers and loyalty points in one place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const TIERS = [
  { name: "Bronze", min: 0, perk: "Standard delivery" },
  { name: "Silver", min: 250, perk: "2% off every bundle" },
  { name: "Gold", min: 1000, perk: "5% off + priority delivery" },
  { name: "Platinum", min: 3000, perk: "8% off + dedicated agent line" },
];

function tierFor(points: number) {
  return [...TIERS].reverse().find((t) => points >= t.min) ?? TIERS[0]!;
}

function AccountPage() {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const queryClient = useQueryClient();

  const fetchAccount = useServerFn(getMyAccount);
  const saveRecipient = useServerFn(saveMyRecipient);
  const removeRecipient = useServerFn(deleteMyRecipient);
  const saveProfile = useServerFn(updateMyProfile);

  const [label, setLabel] = useState("");
  const [number, setNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    if (!loading && !session) void navigate({ to: "/auth" });
  }, [loading, session, navigate]);

  const account = useQuery({
    queryKey: ["account"],
    queryFn: () => fetchAccount({}),
    enabled: Boolean(session),
  });

  useEffect(() => {
    if (account.data && !seeded) {
      setFullName(account.data.profile.full_name ?? "");
      setPhone(account.data.profile.phone ?? "");
      setSeeded(true);
    }
  }, [account.data, seeded]);

  const refresh = () => void queryClient.invalidateQueries({ queryKey: ["account"] });

  const addRecipient = useMutation({
    mutationFn: () =>
      saveRecipient({ data: { label: label.trim(), number: number.trim(), network: "auto" } }),
    onSuccess: () => {
      toast.success("Number saved");
      setLabel("");
      setNumber("");
      refresh();
    },
    onError: () => toast.error("Could not save this number"),
  });

  const profileSave = useMutation({
    mutationFn: () => saveProfile({ data: { fullName, phone } }),
    onSuccess: () => {
      toast.success("Details saved");
      refresh();
    },
    onError: () => toast.error("Could not save your details"),
  });

  if (loading || !session) {
    return (
      <main className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading your account…
      </main>
    );
  }

  const data = account.data;
  const points = data?.profile.points ?? 0;
  const tier = tierFor(points);
  const nextTier = TIERS.find((t) => t.min > points);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 pb-20">
      <div className="flex items-center justify-between">
        <Link to="/" className="text-sm font-semibold text-muted-foreground">
          ← Back to store
        </Link>
        <button
          className="text-sm font-semibold text-destructive"
          onClick={async () => {
            await supabase.auth.signOut();
            queryClient.clear();
            void navigate({ to: "/" });
          }}
        >
          Sign out
        </button>
      </div>

      <h1 className="mt-6 text-3xl font-bold tracking-tight">My account</h1>
      <p className="mt-1 text-sm text-muted-foreground">{data?.profile.email ?? session.user.email}</p>

      {/* Loyalty */}
      <section className="mt-6 rounded-2xl border border-gold/40 bg-gold/10 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Loyalty balance
        </p>
        <p className="mt-1 text-4xl font-bold">{points.toLocaleString()} pts</p>
        <p className="mt-1 text-sm font-semibold">
          {tier.name} member — {tier.perk}
        </p>
        {nextTier ? (
          <p className="mt-1 text-xs text-muted-foreground">
            {(nextTier.min - points).toLocaleString()} points to {nextTier.name}
          </p>
        ) : (
          <p className="mt-1 text-xs text-muted-foreground">Top tier unlocked 🎉</p>
        )}
        <p className="mt-3 text-xs text-muted-foreground">
          You earn 1 point for every unit of local currency spent, added automatically once your
          payment is confirmed.
        </p>
      </section>

      {/* Profile */}
      <section className="mt-6 rounded-2xl border border-border bg-card p-5">
        <h2 className="text-lg font-semibold">Your details</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="ph">Phone</Label>
            <Input id="ph" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
        </div>
        <Button
          className="mt-3"
          disabled={profileSave.isPending}
          onClick={() => profileSave.mutate()}
        >
          {profileSave.isPending ? "Saving…" : "Save details"}
        </Button>
        {data?.profile.referral_code ? (
          <p className="mt-3 text-xs text-muted-foreground">
            Your referral code: <span className="font-semibold">{data.profile.referral_code}</span>
          </p>
        ) : null}
      </section>

      {/* Saved numbers */}
      <section className="mt-6 rounded-2xl border border-border bg-card p-5">
        <h2 className="text-lg font-semibold">Saved numbers</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {(data?.recipients ?? []).map((r) => (
            <span
              key={r.id}
              className="flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1.5 text-sm"
            >
              <span className="font-semibold">{r.label}</span>
              <span className="text-muted-foreground">{r.number}</span>
              <button
                aria-label={`Remove ${r.label}`}
                className="text-destructive"
                onClick={async () => {
                  await removeRecipient({ data: { id: r.id } });
                  refresh();
                }}
              >
                ×
              </button>
            </span>
          ))}
          {data && data.recipients.length === 0 ? (
            <p className="text-sm text-muted-foreground">No saved numbers yet.</p>
          ) : null}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <Input placeholder="Label (e.g. Mom)" value={label} onChange={(e) => setLabel(e.target.value)} />
          <Input placeholder="Number" inputMode="tel" value={number} onChange={(e) => setNumber(e.target.value)} />
          <Button
            disabled={!label.trim() || number.trim().length < 6 || addRecipient.isPending}
            onClick={() => addRecipient.mutate()}
          >
            Add
          </Button>
        </div>
      </section>

      {/* Orders */}
      <section className="mt-6 rounded-2xl border border-border bg-card p-5">
        <h2 className="text-lg font-semibold">Order history</h2>
        {account.isLoading ? <p className="mt-2 text-sm text-muted-foreground">Loading…</p> : null}
        <ul className="mt-3 space-y-3">
          {(data?.orders ?? []).map((o) => (
            <li key={o.reference} className="rounded-xl border border-border p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{o.item}</p>
                  <p className="text-xs text-muted-foreground">
                    {o.country} · {new Date(o.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {o.currency} {Number(o.amount).toLocaleString()}
                  </p>
                  <p className="text-xs font-semibold text-whatsapp">{o.status}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {data && data.orders.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">
            No orders yet — your purchases will appear here.
          </p>
        ) : null}
      </section>

      {/* Points history */}
      {data && data.loyalty.length > 0 ? (
        <section className="mt-6 rounded-2xl border border-border bg-card p-5">
          <h2 className="text-lg font-semibold">Points history</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {data.loyalty.map((l) => (
              <li key={l.id} className="flex justify-between">
                <span className="text-muted-foreground">
                  {l.reason} · {new Date(l.created_at).toLocaleDateString()}
                </span>
                <span className="font-semibold">+{l.points}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
