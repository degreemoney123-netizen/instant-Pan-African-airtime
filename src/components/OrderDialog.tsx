import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  NETWORKS,
  MOMO,
  waLink,
  isValidGhNumber,
  type Bundle,
  type NetworkId,
} from "@/lib/fastdata";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  bundle: Bundle | null;
  network: NetworkId;
};

export function OrderDialog({ open, onOpenChange, bundle, network }: Props) {
  const [phone, setPhone] = useState("");
  const [net, setNet] = useState<NetworkId>(network);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"form" | "pay">("form");

  const active = NETWORKS.find((n) => n.id === net)!;

  if (open && net !== network && step === "form" && phone === "" && !error) {
    // keep dialog network in sync when reopened from another tab
    setNet(network);
  }

  const submit = () => {
    const clean = phone.replace(/\s+/g, "");
    if (!isValidGhNumber(clean)) {
      setError("Enter a valid 10-digit number, e.g. 0593660497");
      return;
    }
    setError("");
    setStep("pay");
  };

  const message = bundle
    ? `Hello! I want to buy ${bundle.size} ${active.short} for GH₵ ${bundle.price}. Send to Phone Number: ${phone.replace(/\s+/g, "")}`
    : "";

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) {
          setStep("form");
          setError("");
        }
      }}
    >
      <DialogContent className="max-w-[92vw] rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {step === "form" ? "Complete your order" : "Payment details"}
          </DialogTitle>
          <DialogDescription>
            {bundle
              ? `${bundle.size} ${active.short} Non-Expiry — GH₵ ${bundle.price}`
              : ""}
          </DialogDescription>
        </DialogHeader>

        {step === "form" ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient mobile number</Label>
              <Input
                id="recipient"
                inputMode="numeric"
                maxLength={13}
                placeholder="059XXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-12 text-base"
              />
              {error ? <p className="text-sm text-destructive">{error}</p> : null}
            </div>

            <div className="space-y-2">
              <Label>Confirm mobile network</Label>
              <div className="grid grid-cols-3 gap-2">
                {NETWORKS.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => setNet(n.id)}
                    className={`rounded-xl border px-2 py-3 text-sm font-semibold transition ${
                      net === n.id
                        ? `${n.accent} border-transparent`
                        : "border-border bg-card text-muted-foreground"
                    }`}
                  >
                    {n.short}
                  </button>
                ))}
              </div>
            </div>

            <Button className="h-12 w-full text-base" onClick={submit}>
              Continue to payment
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-secondary p-4">
              <p className="text-sm font-semibold">Step 1 — Send payment</p>
              <ul className="mt-3 space-y-2">
                {MOMO.map((m) => (
                  <li key={m.label} className="flex justify-between gap-3 text-sm">
                    <span className="text-muted-foreground">{m.label}</span>
                    <span className="font-semibold">{m.value}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm">
                Amount: <span className="font-bold">GH₵ {bundle?.price}</span> · Reference:{" "}
                <span className="font-bold">{phone.replace(/\s+/g, "")}</span>
              </p>
            </div>

            <p className="text-sm text-muted-foreground">
              Step 2 — Send us your payment screenshot on WhatsApp. Delivery is automated and
              usually instant.
            </p>

            <Button asChild variant="whatsapp" className="h-14 w-full text-base">
              <a href={waLink(message)} target="_blank" rel="noopener noreferrer">
                Complete Order on WhatsApp
              </a>
            </Button>
            <button
              type="button"
              onClick={() => setStep("form")}
              className="w-full text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Back to order details
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
