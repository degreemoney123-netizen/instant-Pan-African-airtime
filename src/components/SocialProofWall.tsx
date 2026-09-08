import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { TRUST_TRANSACTIONS } from "@/lib/fastdata";

const REVIEWS = [
  { name: "Kofi A.", city: "Kumasi 🇬🇭", text: "Ordered 10GB at 2am, it landed before I finished paying. Unreal." },
  { name: "Chidi O.", city: "Lagos 🇳🇬", text: "I resell airtime daily — payouts are always on time. Solid platform." },
  { name: "Amina H.", city: "Nairobi 🇰🇪", text: "M-Pesa checkout worked first try and the receipt came instantly." },
  { name: "Thandi M.", city: "Johannesburg 🇿🇦", text: "Cheapest non-expiry data I've found, and support replies in minutes." },
];

export function SocialProofWall() {
  const [delivered, setDelivered] = useState(1284);

  useEffect(() => {
    const t = setInterval(() => setDelivered((d) => d + 1), 9000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="mt-8 px-5">
      <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1 text-gold">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="size-4 fill-current" />
              ))}
              <span className="ml-1 font-display text-sm font-bold text-foreground">4.9</span>
            </div>
            <p className="mt-1 text-[11px] font-semibold text-muted-foreground">
              from {TRUST_TRANSACTIONS.toLocaleString("en-US")}+ completed orders
            </p>
          </div>
          <div className="rounded-2xl bg-whatsapp/10 px-3 py-2 text-center">
            <p className="font-display text-lg font-bold text-whatsapp tabular-nums">
              {delivered.toLocaleString("en-US")}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
              delivered today
            </p>
          </div>
        </div>

        <ul className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {REVIEWS.map((r) => (
            <li
              key={r.name}
              className="w-60 shrink-0 rounded-2xl border border-border bg-surface p-4"
            >
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-full bg-navy font-display text-xs font-bold text-primary-foreground">
                  {r.name.slice(0, 1)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold">{r.name}</p>
                  <p className="truncate text-[10px] text-muted-foreground">{r.city}</p>
                </div>
              </div>
              <div className="mt-2 flex text-gold">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="size-3 fill-current" />
                ))}
              </div>
              <p className="mt-2 text-[11px] leading-snug text-muted-foreground">“{r.text}”</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
