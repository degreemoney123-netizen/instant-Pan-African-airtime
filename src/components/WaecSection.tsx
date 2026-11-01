import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CHECKERS } from "@/lib/checkers";
import { COUNTRIES, type Country } from "@/lib/fastdata";
import { openPaystackCheckout, paystackCharge } from "@/lib/paystack";
import { createCheckerOrder, getCheckerOrder, retrieveCheckers } from "@/lib/checkers.functions";

type Checker = (typeof CHECKERS)[number];
type Voucher = { serial: string; pin: string; kind: string };

const ghana = (COUNTRIES.find((c) => c.code === "GH") ?? COUNTRIES[0]) as Country;
const clean = (s: string) => s.trim().replace(/[\s-]/g, "");
const nameOf = (kind: string) => CHECKERS.find((c) => c.id === kind)?.name ?? kind;

function VoucherList({ vouchers }: { vouchers: Voucher[] }) {
  return (
    <ul className="space-y-3">
      {vouchers.map((v) => (
        <li key={v.serial} className="rounded-2xl border border-border bg-secondary p-4 text-sm">
          <p className="text-xs text-muted-foreground">{nameOf(v.kind)}</p>
          <p className="mt-1">
            Serial: <span className="font-bold">{v.serial}</span>
          </p>
          <p>
            PIN: <span className="font-bold tracking-wider">{v.pin}</span>
          </p>
          <Button
            size="sm"
            variant="outline"
            className="mt-2"
            onClick={() => {
              void navigator.clipboard.writeText(v.pin);
              toast.success("PIN copied");
            }}
          >
            Copy PIN
          </Button>
        </li>
      ))}
    </ul>
  );
}

export function WaecSection() {
  const createFn = useServerFn(createCheckerOrder);
  const statusFn = useServerFn(getCheckerOrder);
  const retrieveFn = useServerFn(retrieveCheckers);

  const [checker, setChecker] = useState<Checker | null>(null);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const [doneRef, setDoneRef] = useState<string | null>(null);
  const [done, setDone] = useState<{ status: string; vouchers: Voucher[] } | null>(null);

  const [retrieveOpen, setRetrieveOpen] = useState(false);
  const [rPhone, setRPhone] = useState("");
  const [rEmail, setREmail] = useState("");
  const [rResults, setRResults] = useState<Voucher[] | null>(null);

  // Poll until payment is confirmed and PINs are assigned.
  useEffect(() => {
    if (!doneRef) return;
    let stop = false;
    const tick = async () => {
      const res = await statusFn({ data: { reference: doneRef } }).catch(() => null);
      if (stop || !res) return;
      setDone({ status: res.status, vouchers: res.vouchers });
      if (res.status === "Delivered") stop = true;
    };
    void tick();
    const id = setInterval(() => !stop && void tick(), 4000);
    return () => {
      stop = true;
      clearInterval(id);
    };
  }, [doneRef, statusFn]);

  const pay = async () => {
    if (!checker) return;
    if (!/^0\d{9}$/.test(clean(phone))) return setError("Enter a valid 10-digit phone number.");
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError("Enter a valid email address.");
    setError("");
    setBusy(true);
    try {
      const { reference, amount } = await createFn({
        data: { kind: checker.id, qty, recipient: clean(phone), email: email.trim() },
      });
      await openPaystackCheckout({
        charge: paystackCharge(ghana, amount),
        reference,
        email: email.trim(),
        metadata: { purpose: "waec_checker", kind: checker.id, qty, recipient: clean(phone) },
        onSuccess: (ref) => {
          setChecker(null);
          setDone(null);
          setDoneRef(ref);
        },
        onClose: () => setBusy(false),
      });
    } catch {
      toast.error("Could not start payment. Please try again.");
      setBusy(false);
    }
  };

  const retrieve = async () => {
    if (!/^0\d{9}$/.test(clean(rPhone)) || !/^\S+@\S+\.\S+$/.test(rEmail.trim())) {
      toast.error("Enter the phone number and email used to buy.");
      return;
    }
    const rows = await retrieveFn({ data: { recipient: clean(rPhone), email: rEmail.trim() } }).catch(
      () => null,
    );
    setRResults(rows ?? []);
  };

  return (
    <section id="waec" className="scroll-mt-20 px-4 py-8">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">🎓 WAEC &amp; Educational Vouchers</h2>
          <p className="text-sm text-muted-foreground">Results checker PINs delivered instantly.</p>
        </div>
        <Button size="sm" variant="outline" onClick={() => setRetrieveOpen(true)}>
          Retrieve Past Checkers
        </Button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {CHECKERS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => {
              setChecker(c);
              setQty(1);
              setError("");
              setBusy(false);
            }}
            className="flex h-full flex-col rounded-2xl border border-border bg-card p-4 text-left shadow-card transition hover:border-gold"
          >
            <span className="text-sm font-bold leading-tight">{c.name}</span>
            <span className="mt-2 font-display text-lg font-bold">GH₵ {c.price.toFixed(2)}</span>
          </button>
        ))}
      </div>

      <Dialog open={!!checker} onOpenChange={(v) => !v && setChecker(null)}>
        <DialogContent className="max-w-[92vw] rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">{checker?.name}</DialogTitle>
            <DialogDescription>GH₵ {checker?.price.toFixed(2)} per checker</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="w-phone">Recipient phone number</Label>
              <Input id="w-phone" inputMode="tel" maxLength={15} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. 0241234567" className="h-12" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="w-email">Email address</Label>
              <Input id="w-email" type="email" maxLength={160} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="h-12" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="w-qty">Quantity</Label>
              <Input id="w-qty" type="number" min={1} max={20} value={qty} onChange={(e) => setQty(Math.min(20, Math.max(1, Number(e.target.value) || 1)))} className="h-12" />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button className="h-12 w-full text-base" disabled={busy} onClick={pay}>
              Pay GH₵ {((checker?.price ?? 0) * qty).toFixed(2)}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!doneRef} onOpenChange={(v) => !v && setDoneRef(null)}>
        <DialogContent className="max-w-[92vw] rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Order Complete</DialogTitle>
            <DialogDescription>Reference: {doneRef}</DialogDescription>
          </DialogHeader>
          {done && done.vouchers.length > 0 ? (
            <VoucherList vouchers={done.vouchers} />
          ) : (
            <p className="text-sm text-muted-foreground">
              {done?.status === "Pending Payment"
                ? "Confirming your payment…"
                : "Payment received. Your Serial & PIN are being prepared — they'll appear here and under Retrieve Past Checkers."}
            </p>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={retrieveOpen} onOpenChange={(v) => { setRetrieveOpen(v); if (!v) setRResults(null); }}>
        <DialogContent className="max-w-[92vw] rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Retrieve Past Checkers</DialogTitle>
            <DialogDescription>Enter the phone number and email you used to buy.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input inputMode="tel" maxLength={15} value={rPhone} onChange={(e) => setRPhone(e.target.value)} placeholder="Phone number" className="h-12" />
            <Input type="email" maxLength={160} value={rEmail} onChange={(e) => setREmail(e.target.value)} placeholder="Email address" className="h-12" />
            <Button className="h-12 w-full" onClick={retrieve}>Find my checkers</Button>
            {rResults ? (
              rResults.length ? <VoucherList vouchers={rResults} /> : <p className="text-sm text-muted-foreground">No checkers found.</p>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
