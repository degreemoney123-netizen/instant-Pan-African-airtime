import { useEffect, useState } from "react";
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
  ACCENT_BG,
  formatMoney,
  waLink,
  isValidPhone,
  makeOrderId,
  type Bundle,
  type Country,
  type Network,
} from "@/lib/fastdata";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  bundle: Bundle | null;
  country: Country;
  network: Network;
  onReceipt: (r: {
    orderId: string;
    recipient: string;
    item: string;
    amount: string;
    country: string;
    date: string;
  }) => void;
};

export function OrderDialog({ open, onOpenChange, bundle, country, network, onReceipt }: Props) {
  const [phone, setPhone] = useState("");
  const [netId, setNetId] = useState(network.id);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"form" | "pay">("form");
  const [reference, setReference] = useState("");
  const [saving, setSaving] = useState(false);
  const createOrder = useServerFn(createPendingOrder);

  useEffect(() => {
    if (open) {
      setNetId(network.id);
      setStep("form");
      setError("");
      setReference("");
    }
  }, [open, network.id]);

  const active = country.networks.find((x) => x.id === netId) ?? network;

  const submit = async () => {
    const clean = phone.replace(/[\s-]/g, "");
    if (!isValidPhone(clean)) {
      setError("Enter a valid mobile number for " + country.name);
      return;
    }
    if (!bundle) return;
    setError("");
    setSaving(true);
    const orderId = makeOrderId("FD", clean);
    const item = `${bundle.size} ${active.short} Non-Expiry`;

    try {
      const res = await createOrder({
        data: {
          orderId,
          recipient: clean,
          item,
          amount: bundle.price,
          currency: country.currency,
          country: `${country.flag} ${country.name}`,
        },
      });
      setReference(res.reference);
    } catch {
      setError("We could not start this order. Please try again.");
      setSaving(false);
      return;
    }

    setSaving(false);
    setStep("pay");
    onReceipt({
      orderId,
      recipient: clean,
      item,
      amount: formatMoney(country, bundle.price),
      country: `${country.flag} ${country.name}`,
      date: new Date().toLocaleString(),
    });
  };

  const message =
    bundle &&
    `Hello! I want to buy ${bundle.size} ${active.short} (${country.name} ${country.flag}) for ${formatMoney(country, bundle.price)}. Send to Phone Number: ${phone.replace(/[\s-]/g, "")}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[92vw] rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {step === "form" ? "Complete your order" : "Payment details"}
          </DialogTitle>
          <DialogDescription>
            {bundle
              ? `${bundle.size} ${active.short} Non-Expiry — ${formatMoney(country, bundle.price)} (${country.currency})`
              : ""}
          </DialogDescription>
        </DialogHeader>

        {step === "form" ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient mobile number</Label>
              <Input
                id="recipient"
                inputMode="tel"
                maxLength={15}
                placeholder="e.g. 059XXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-12 text-base"
              />
              {error ? <p className="text-sm text-destructive">{error}</p> : null}
            </div>

            <div className="space-y-2">
              <Label>
                Confirm mobile network in {country.flag} {country.name}
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {country.networks.map((x) => (
                  <button
                    key={x.id}
                    type="button"
                    onClick={() => setNetId(x.id)}
                    className={`rounded-xl border px-2 py-3 text-xs font-semibold transition ${
                      netId === x.id
                        ? `${ACCENT_BG[x.accent]} border-transparent`
                        : "border-border bg-card text-muted-foreground"
                    }`}
                  >
                    {x.short}
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
              <p className="text-sm font-semibold">
                Step 1 — Pay in {country.currency} via Paystack or Mobile Money
              </p>
              <ul className="mt-3 space-y-2">
                {country.momo.map((m) => (
                  <li key={m.label} className="flex justify-between gap-3 text-sm">
                    <span className="text-muted-foreground">{m.label}</span>
                    <span className="font-semibold">{m.value}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm">
                Amount:{" "}
                <span className="font-bold">
                  {bundle ? formatMoney(country, bundle.price) : ""}
                </span>{" "}
                · Reference: <span className="font-bold">{phone.replace(/[\s-]/g, "")}</span>
              </p>
            </div>

            <p className="text-sm text-muted-foreground">
              Step 2 — Send your payment screenshot on WhatsApp. Delivery is automated and usually
              instant.
            </p>

            <Button asChild variant="whatsapp" className="h-14 w-full text-base">
              <a href={waLink(message ?? "")} target="_blank" rel="noopener noreferrer">
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
