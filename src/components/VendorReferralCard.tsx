import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Copy, Users } from "lucide-react";
import { claimReferral, getReferralInfo, setReferralRate } from "@/lib/referral.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PENDING_KEY = "fastdata.vendor.ref";

export function VendorReferralCard() {
  const qc = useQueryClient();
  const fetchInfo = useServerFn(getReferralInfo);
  const claim = useServerFn(claimReferral);
  const setRate = useServerFn(setReferralRate);
  const info = useQuery({ queryKey: ["vendor-referral"], queryFn: () => fetchInfo() });
  const [code, setCode] = useState("");
  const [rate, setRateInput] = useState("");
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
    const fromUrl = new URLSearchParams(window.location.search).get("ref");
    if (fromUrl) localStorage.setItem(PENDING_KEY, fromUrl);
    const pending = fromUrl ?? localStorage.getItem(PENDING_KEY);
    if (pending) setCode(pending);
  }, []);

  useEffect(() => {
    if (info.data) setRateInput(String(info.data.ratePercent));
  }, [info.data]);

  const refresh = () => {
    void qc.invalidateQueries({ queryKey: ["vendor-referral"] });
    void qc.invalidateQueries({ queryKey: ["vendor-dashboard"] });
  };

  const claimMut = useMutation({
    mutationFn: () => claim({ data: { code } }),
    onSuccess: (r) => {
      if (!r.ok) return void toast.error(r.message);
      localStorage.removeItem(PENDING_KEY);
      toast.success("You're linked to your referrer");
      refresh();
    },
  });
  const rateMut = useMutation({
    mutationFn: () => setRate({ data: { percent: Number(rate) } }),
    onSuccess: (r) => {
      toast.success(`Commission set to ${r.percent}%`);
      refresh();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not save"),
  });

  const d = info.data;
  if (!d) return null;
  const link = `${origin}/vendor?ref=${d.code}`;

  return (
    <section className="mt-6 rounded-2xl border bg-card p-5">
      <div className="flex items-center gap-2">
        <Users className="size-5 text-primary" />
        <h2 className="text-lg font-bold">Refer agents, earn {d.ratePercent}%</h2>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Every time an agent you invite sells a bundle, {d.ratePercent}% of the sale goes straight into your wallet.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-muted p-3">
          <p className="text-xs text-muted-foreground">Agents referred</p>
          <p className="text-2xl font-bold">{d.agentsReferred}</p>
        </div>
        <div className="rounded-xl bg-muted p-3">
          <p className="text-xs text-muted-foreground">Commission earned</p>
          <p className="text-2xl font-bold">GH₵ {d.earned.toFixed(2)}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-xl border px-3 py-2">
        <span className="truncate text-xs font-semibold">{link}</span>
        <button
          type="button"
          aria-label="Copy referral link"
          className="ml-auto"
          onClick={() => void navigator.clipboard.writeText(link).then(() => toast.success("Link copied"))}
        >
          <Copy className="size-4" />
        </button>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">Your code: <b>{d.code}</b></p>

      {!d.referredBy && (
        <div className="mt-4 flex gap-2">
          <Input placeholder="Referred by? Enter code" value={code} onChange={(e) => setCode(e.target.value)} />
          <Button variant="outline" disabled={claimMut.isPending || code.trim().length < 4} onClick={() => claimMut.mutate()}>
            Apply
          </Button>
        </div>
      )}

      {d.isAdmin && (
        <div className="mt-4 rounded-xl border border-dashed p-3">
          <p className="text-xs font-semibold">Admin: commission rate (%)</p>
          <div className="mt-2 flex gap-2">
            <Input inputMode="decimal" value={rate} onChange={(e) => setRateInput(e.target.value)} />
            <Button disabled={rateMut.isPending} onClick={() => rateMut.mutate()}>Save</Button>
          </div>
        </div>
      )}
    </section>
  );
}
