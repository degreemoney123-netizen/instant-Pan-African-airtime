import { TRUST_TRANSACTIONS } from "@/lib/fastdata";

const BADGES = [
  { label: "MTN Mobile Money", note: "Merchant verified", accent: "bg-mtn text-mtn-foreground" },
  { label: "Telecel Cash", note: "Direct transfers", accent: "bg-telecel text-telecel-foreground" },
  { label: "AT Money", note: "Instant payouts", accent: "bg-at text-at-foreground" },
  { label: "Paystack Verified", note: "Card & bank", accent: "bg-primary text-primary-foreground" },
  {
    label: "256-Bit SSL Encryption",
    note: "Bank-grade security",
    accent: "bg-whatsapp text-whatsapp-foreground",
  },
];

const GUARANTEES = [
  {
    icon: "🛡️",
    title: "100% Delivery Guarantee",
    note: "Not delivered? You get an instant, no-questions refund.",
  },
  {
    icon: "⚡",
    title: "Automated Instant Delivery",
    note: "Most bundles land in under 60 seconds, 24/7.",
  },
  {
    icon: "✅",
    title: "Verified Payment Partners",
    note: "Paystack & Mobile Money merchant-verified checkout.",
  },
];

export function TrustBadges() {
  return (
    <section className="mt-4 px-4">
      <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-whatsapp/15 text-sm">
            🔒
          </span>
          <div>
            <h2 className="text-base font-bold">Guaranteed Safe &amp; Secure Checkout</h2>
            <p className="text-xs text-muted-foreground">
              Every payment is processed through verified, encrypted channels.
            </p>
          </div>
        </div>
        <ul className="mt-4 grid grid-cols-2 gap-2">
          {BADGES.map((b) => (
            <li
              key={b.label}
              className="rounded-xl border border-border bg-surface p-3 last:col-span-2"
            >
              <span
                className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${b.accent}`}
              >
                Verified
              </span>
              <p className="mt-1.5 text-xs font-bold leading-tight">{b.label}</p>
              <p className="text-[11px] text-muted-foreground">{b.note}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 rounded-2xl border border-border bg-card p-5 shadow-card">
        <h2 className="text-base font-bold">Why customers trust FastData</h2>
        <ul className="mt-3 space-y-2">
          {GUARANTEES.map((g) => (
            <li
              key={g.title}
              className="flex gap-3 rounded-xl border border-border bg-surface p-3"
            >
              <span className="text-lg leading-none">{g.icon}</span>
              <div className="min-w-0">
                <p className="text-sm font-bold leading-tight">{g.title}</p>
                <p className="text-[11px] text-muted-foreground">{g.note}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4 rounded-xl bg-whatsapp/10 p-3 text-center">
          <p className="text-2xl font-extrabold text-whatsapp">
            {TRUST_TRANSACTIONS.toLocaleString("en-US")}+
          </p>
          <p className="text-xs font-semibold text-muted-foreground">
            successful transactions completed across Africa
          </p>
        </div>
      </div>
    </section>
  );
}
