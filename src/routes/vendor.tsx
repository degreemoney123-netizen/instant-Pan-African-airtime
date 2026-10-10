import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/lib/useAuth";
import { buyWithWallet, getVendorDashboard, startWalletTopup } from "@/lib/vendor.functions";
import { COUNTRIES, bundlesFor, formatMoney } from "@/lib/fastdata";
import { openPaystackCheckout, paystackCharge, PAYSTACK_MODE } from "@/lib/paystack";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VendorReferralCard } from "@/components/VendorReferralCard";

export const Route = createFileRoute("/vendor")({
  component: VendorDashboard,
  head: () => ({
    meta: [
      { title: "Vendor dashboard — wallet, orders & instant bundles" },
      {
        name: "description",
        content: "FastData Africa vendors: top up your wallet, sell data bundles instantly and track every order you deliver.",
      },
      { property: "og:title", content: "FastData Africa vendor dashboard" },
      { property: "og:description", content: "Wallet balance, top-ups and automatic bundle delivery for vendors." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const GH = COUNTRIES.find((c) => c.code === "GH")!;
const QUICK = [20, 50, 100, 200];

function statusClass(s: string) {
  if (s === "Delivered" || s === "Completed") return "bg-primary/10 text-primary";
  if (s.includes("Processing")) return "bg-accent/30 text-foreground";
  return "bg-muted text-muted-foreground";
}

function VendorDashboard() {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const qc = useQueryClient();
  const fetchDash = useServerFn(getVendorDashboard);
  const topup = useServerFn(startWalletTopup);
  const buy = useServerFn(buyWithWallet);

  const [amount, setAmount] = useState("50");
  const [netIndex, setNetIndex] = useState(0);
  const [size, setSize] = useState("");
  const [recipient, setRecipient] = useState("");

  useEffect(() => {
    if (!loading && !session) void navigate({ to: "/auth" });
  }, [loading, session, navigate]);

  const dash = useQuery({
    queryKey: ["vendor-dashboard"],
    queryFn: () => fetchDash(),
    enabled: Boolean(session),
    refetchInterval: 8000,
  });
  const refresh = () => void qc.invalidateQueries({ queryKey: ["vendor-dashboard"] });

  const bundles = bundlesFor(GH, netIndex);
  const selected = bundles.find((b) => b.size === size) ?? bundles[0]!;

  const topupMut = useMutation({
    mutationFn: async () => {
      const value = Number(amount);
      if (!Number.isFinite(value) || value < 5) throw new Error("Minimum top-up is GH₵ 5");
      const { reference, email } = await topup({ data: { amount: value } });
      await openPaystackCheckout({
        charge: paystackCharge(GH, value),
        reference,
        email,
        metadata: { purpose: "wallet_topup" },
        onSuccess: () => {
          toast.success("Payment received — your wallet updates in a few seconds");
          setTimeout(refresh, 3000);
        },
        onClose: () => refresh(),
      });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Top-up failed"),
  });

  const buyMut = useMutation({
    mutationFn: () => buy({ data: { networkIndex: netIndex, size: selected.size, recipient: recipient.trim() } }),
    onSuccess: (r) => {
      if (!r.ok) {
        toast.error(r.message);
        return;
      }
      toast.success(`${r.item} → ${recipient}: ${r.status}`);
      setRecipient("");
      refresh();
    },
    onError: () => toast.error("Could not complete the purchase"),
  });

  if (loading || !session) {
    return <main className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Loading…</main>;
  }

  const d = dash.data;
  const delivered = d?.orders.filter((o) => o.status === "Delivered").length ?? 0;
  const spent = d?.orders.reduce((s, o) => s + Number(o.amount), 0) ?? 0;

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 pb-24">
      <div className="flex items-center justify-between">
        <Link to="/" className="text-sm font-semibold text-muted-foreground">← Back to store</Link>
        <Link to="/account" className="text-sm font-semibold text-primary">My account</Link>
      </div>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">Vendor dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Sell bundles from your wallet — delivery is automatic.</p>

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-primary p-5 text-primary-foreground sm:col-span-1">
          <p className="text-xs uppercase tracking-wider opacity-80">Wallet balance</p>
          <p className="mt-2 text-3xl font-bold">{formatMoney(GH, d?.balance ?? 0)}</p>
        </div>
        <div className="rounded-2xl border bg-card p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Orders delivered</p>
          <p className="mt-2 text-3xl font-bold">{delivered}</p>
        </div>
        <div className="rounded-2xl border bg-card p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Total sold</p>
          <p className="mt-2 text-3xl font-bold">{formatMoney(GH, spent)}</p>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border bg-card p-5">
          <h2 className="text-lg font-bold">Top up wallet</h2>
          <p className="text-xs text-muted-foreground">
            Pay with MoMo or card via Paystack{PAYSTACK_MODE === "test" ? " (test mode)" : ""}. Credited once payment is confirmed.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {QUICK.map((q) => (
              <button key={q} onClick={() => setAmount(String(q))}
                className={`rounded-full border px-3 py-1 text-sm font-semibold ${amount === String(q) ? "border-primary bg-primary/10 text-primary" : ""}`}>
                GH₵ {q}
              </button>
            ))}
          </div>
          <Label className="mt-3 block" htmlFor="amt">Amount (GH₵)</Label>
          <Input id="amt" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <Button className="mt-3 w-full" disabled={topupMut.isPending} onClick={() => topupMut.mutate()}>
            {topupMut.isPending ? "Opening payment…" : "Top up now"}
          </Button>
        </div>

        <div className="rounded-2xl border bg-card p-5">
          <h2 className="text-lg font-bold">Sell a bundle</h2>
          <p className="text-xs text-muted-foreground">Paid from your wallet and delivered automatically.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {GH.networks.map((n, i) => (
              <button key={n.name} onClick={() => { setNetIndex(i); setSize(""); }}
                className={`rounded-full border px-3 py-1 text-sm font-semibold ${netIndex === i ? "border-primary bg-primary/10 text-primary" : ""}`}>
                {n.name}
              </button>
            ))}
          </div>
          <Label className="mt-3 block" htmlFor="pkg">Package</Label>
          <select id="pkg" value={selected.size} onChange={(e) => setSize(e.target.value)}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm">
            {bundles.map((b) => <option key={b.size} value={b.size}>{b.size} — {formatMoney(GH, b.price)}</option>)}
          </select>
          <Label className="mt-3 block" htmlFor="rcp">Customer number</Label>
          <Input id="rcp" inputMode="tel" placeholder="024XXXXXXX" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
          <Button className="mt-3 w-full" disabled={buyMut.isPending || !/^0\d{9}$/.test(recipient.trim())}
            onClick={() => buyMut.mutate()}>
            {buyMut.isPending ? "Delivering…" : `Send ${selected.size} · ${formatMoney(GH, selected.price)}`}
          </Button>
        </div>
      </section>

      <VendorReferralCard />

      <section className="mt-6 rounded-2xl border bg-card p-5">
        <h2 className="text-lg font-bold">My orders</h2>
        {!d?.orders.length ? (
          <p className="mt-2 text-sm text-muted-foreground">No orders yet.</p>
        ) : (
          <ul className="mt-3 divide-y">
            {d.orders.map((o) => (
              <li key={o.reference} className="flex items-center justify-between gap-3 py-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{o.item}</p>
                  <p className="text-xs text-muted-foreground">{o.recipient} · {new Date(o.created_at).toLocaleString()} · {o.reference}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{o.currency} {Number(o.amount).toFixed(2)}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusClass(o.status)}`}>{o.status}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6 rounded-2xl border bg-card p-5">
        <h2 className="text-lg font-bold">Wallet history</h2>
        {!d?.transactions.length ? (
          <p className="mt-2 text-sm text-muted-foreground">No wallet activity yet.</p>
        ) : (
          <ul className="mt-3 divide-y">
            {d.transactions.map((t) => (
              <li key={t.reference} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-semibold">{t.kind === "topup" ? "Top-up" : t.kind === "referral" ? "Referral commission" : "Purchase"}</p>
                  <p className="text-xs text-muted-foreground">{t.note} · {new Date(t.created_at).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{t.kind === "purchase" ? "−" : "+"}{formatMoney(GH, Number(t.amount))}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusClass(t.status)}`}>{t.status}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
