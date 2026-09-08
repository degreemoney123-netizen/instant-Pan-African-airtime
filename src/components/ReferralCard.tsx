import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Check, Copy, Gift, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { waLink } from "@/lib/fastdata";

const KEY = "fastdata.referral.code";

function makeCode() {
  return `FD-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

export function ReferralCard() {
  const [code, setCode] = useState("FD-XXXXX");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) {
        setCode(saved);
      } else {
        const fresh = makeCode();
        localStorage.setItem(KEY, fresh);
        setCode(fresh);
      }
    } catch {
      setCode(makeCode());
    }
  }, []);

  const link = useMemo(() => {
    if (typeof window === "undefined") return `https://fastdataafrica.com/?ref=${code}`;
    return `${window.location.origin}/?ref=${code}`;
  }, [code]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success("Referral link copied");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Copy failed — long-press the link to copy");
    }
  };

  return (
    <section className="mt-8 px-5">
      <div className="overflow-hidden rounded-3xl bg-navy p-6 text-primary-foreground shadow-pop">
        <div className="flex items-center gap-2">
          <Gift className="size-5 text-gold" />
          <h2 className="font-display text-lg font-bold">Invite friends, earn free data</h2>
        </div>
        <p className="mt-2 text-sm text-primary-foreground/70">
          Share your link. Your friend gets 10% off their first bundle and you earn 100 points —
          1,000 points is a free 5GB bundle.
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          {[
            ["Your points", "100"],
            ["Friends joined", "1"],
            ["Free bundles", "0"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-2xl bg-primary-foreground/10 p-3">
              <p className="font-display text-lg font-bold text-gold">{v}</p>
              <p className="text-[10px] font-semibold text-primary-foreground/60">{k}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between gap-2 rounded-2xl bg-primary-foreground/10 px-3 py-3">
          <span className="truncate text-xs font-semibold">{link}</span>
          <button type="button" onClick={copy} aria-label="Copy referral link">
            {copied ? <Check className="size-4 text-gold" /> : <Copy className="size-4" />}
          </button>
        </div>

        <Button asChild variant="gold" className="mt-3 h-12 w-full text-base">
          <a
            href={waLink(`Get instant data bundles across Africa with FastData — use my link for 10% off: ${link}`)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Share2 className="size-4" />
            Share on WhatsApp
          </a>
        </Button>
      </div>
    </section>
  );
}
