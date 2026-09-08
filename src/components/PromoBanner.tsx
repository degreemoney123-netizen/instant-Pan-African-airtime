import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

export const PROMO_CODE = "FIRST10";

function nextMidnight() {
  const d = new Date();
  d.setHours(24, 0, 0, 0);
  return d.getTime();
}

function useCountdown() {
  const [left, setLeft] = useState(() => nextMidnight() - Date.now());
  useEffect(() => {
    const t = setInterval(() => setLeft(nextMidnight() - Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const total = Math.max(0, Math.floor(left / 1000));
  const h = String(Math.floor(total / 3600)).padStart(2, "0");
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return { h, m, s };
}

export function PromoBanner() {
  const { h, m, s } = useCountdown();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROMO_CODE);
      setCopied(true);
      toast.success("Discount code copied");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Copy failed — type the code manually");
    }
  };

  return (
    <section className="px-5 pt-6">
      <div className="flex items-center gap-3 rounded-3xl border border-gold/30 bg-gold/10 p-4">
        <span className="text-xl leading-none">🔥</span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold leading-tight">
            10% off your first order with code{" "}
            <button
              type="button"
              onClick={copy}
              className="inline-flex items-center gap-1 rounded-md bg-navy px-1.5 py-0.5 font-display text-xs text-primary-foreground"
            >
              {PROMO_CODE}
              {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
            </button>
          </p>
          <p className="mt-1 text-[11px] font-semibold text-muted-foreground">
            Today&apos;s deal ends in{" "}
            <span className="font-display tabular-nums text-foreground">
              {h}:{m}:{s}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
