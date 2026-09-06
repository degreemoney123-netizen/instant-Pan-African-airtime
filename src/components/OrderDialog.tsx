import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Check, Copy } from "lucide-react";
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
import { createPendingOrder } from "@/lib/orders.functions";
import { openPaystackCheckout, paystackCharge } from "@/lib/paystack";
import {
  ACCENT_BG,
  PAYMENT_METHODS,
  detectNetwork,
  formatMoney,
  isValidLocalPhone,
  makeOrderId,
  normalizePhone,
  waLink,
  type Bundle,
  type Country,
  type Network,
  type PaymentMethodId,
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

type Step = 1 | 2 | 3;

const STEP_LABELS: Record<Step, string> = {
  1: "Recipient details",
  2: "Payment method",
  3: "Confirm & pay",
};

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(`${label} copied`);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("Copy failed — long-press to copy manually");
    }
  };
  return (
    <li className="flex items-center justify-between gap-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <button
        type="button"
        onClick={copy}
        className="inline-flex items-center gap-1.5 font-semibold underline-offset-4 hover:underline"
      >
        {value}
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      </button>
    </li>
  );
}

export function OrderDialog({ open, onOpenChange, bundle, country, network, onReceipt }: Props) {
  const [phone, setPhone] = useState("");
  const [netId, setNetId] = useState(network.id);
  const [autoDetected, setAutoDetected] = useState(false);
  const [method, setMethod] = useState<PaymentMethodId>("paystack");
  const [error, setError] = useState("");
  const [step, setStep] = useState<Step>(1);
  const [reference, setReference] = useState("");
  const [orderIdValue, setOrderIdValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [paying, setPaying] = useState(false);
  const navigate = useNavigate();
  const createOrder = useServerFn(createPendingOrder);

  useEffect(() => {
    if (open) {
      setNetId(network.id);
      setStep(1);
      setError("");
      setReference("");
      setOrderIdValue("");
      setMethod("paystack");
      setAutoDetected(false);
    }
  }, [open, network.id]);

  const active = country.networks.find((x) => x.id === netId) ?? network;
  const local = useMemo(() => normalizePhone(phone, country), [phone, country]);
  const item = bundle ? `${bundle.size} ${active.short} Non-Expiry` : "";

  const onPhoneChange = (value: string) => {
    setPhone(value);
    const guess = detectNetwork(value, country);
    if (guess && guess !== netId) {
      setNetId(guess);
      setAutoDetected(true);
    } else if (!guess) {
      setAutoDetected(false);
    }
  };

  const next = async () => {
    if (step === 1) {
      if (!isValidLocalPhone(phone, country)) {
        setError(`Enter a valid ${country.name} mobile number (e.g. 059XXXXXXX).`);
        return;
      }
      setError("");
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!bundle) return;
      setError("");
      setSaving(true);
      const orderId = makeOrderId("FD", local);
      try {
        const res = await createOrder({
          data: {
            orderId,
            recipient: local,
            item,
            amount: bundle.price,
            currency: country.currency,
            country: `${country.flag} ${country.name}`,
          },
        });
        setReference(res.reference);
        setOrderIdValue(orderId);
        setStep(3);
        toast.success("Order created — complete payment to confirm");
      } catch {
        setError("We could not start this order. Please try again.");
        toast.error("Could not create the order");
      } finally {
        setSaving(false);
      }
    }
  };

  const message =
    bundle &&
    `Hello! I want to buy ${bundle.size} ${active.short} (${country.name} ${country.flag}) for ${formatMoney(country, bundle.price)}. Send to Phone Number: ${local}. Payment reference: ${reference}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-[92vw] overflow-y-auto rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{STEP_LABELS[step]}</DialogTitle>
          <DialogDescription>
            {bundle
              ? `${bundle.size} ${active.short} Non-Expiry — ${formatMoney(country, bundle.price)} (${country.currency})`
              : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2" aria-hidden>
          {[1, 2, 3].map((s) => (
            <span
              key={s}
              className={`h-1.5 flex-1 rounded-full ${s <= step ? "bg-primary" : "bg-secondary"}`}
            />
          ))}
        </div>

        {step === 1 ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient mobile number</Label>
              <div className="flex items-center gap-2">
                <span className="rounded-xl border border-border bg-secondary px-3 py-3 text-sm font-semibold">
                  {country.dial}
                </span>
                <Input
                  id="recipient"
                  inputMode="tel"
                  maxLength={16}
                  placeholder="e.g. 059XXXXXXX"
                  value={phone}
                  onChange={(e) => onPhoneChange(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && void next()}
                  className="h-12 text-base"
                />
              </div>
              {autoDetected ? (
                <p className="text-xs font-semibold text-whatsapp">
                  Network auto-detected: {active.name}
                </p>
              ) : null}
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
                    onClick={() => {
                      setNetId(x.id);
                      setAutoDetected(false);
                    }}
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

            <Button className="h-12 w-full text-base" onClick={() => void next()}>
              Continue
            </Button>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-4">
            <div className="space-y-2">
              {PAYMENT_METHODS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition ${
                    method === m.id ? "border-primary bg-secondary" : "border-border bg-card"
                  }`}
                >
                  <span className="text-2xl">{m.icon}</span>
                  <span className="flex-1">
                    <span className="block text-sm font-bold">{m.name}</span>
                    <span className="block text-xs text-muted-foreground">{m.blurb}</span>
                  </span>
                  <span
                    className={`size-4 rounded-full border-2 ${method === m.id ? "border-primary bg-primary" : "border-border"}`}
                  />
                </button>
              ))}
            </div>

            {method === "wallet" ? (
              <p className="text-xs text-muted-foreground">
                Agent wallet payments are settled from your dashboard balance. Top up in the{" "}
                <Link to="/dashboard" className="font-semibold underline underline-offset-4">
                  Agent Portal
                </Link>
                .
              </p>
            ) : null}

            {error ? <p className="text-sm text-destructive">{error}</p> : null}

            <Button className="h-12 w-full text-base" onClick={() => void next()} disabled={saving}>
              {saving ? "Creating order…" : "Continue to confirmation"}
            </Button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Back
            </button>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-4">
            <dl className="rounded-2xl border border-border bg-secondary p-4 text-sm">
              {[
                ["Package", item],
                ["Recipient", local],
                ["Country", `${country.flag} ${country.name}`],
                ["Total", bundle ? formatMoney(country, bundle.price) : ""],
                ["Reference", reference],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3 py-1">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="text-right font-semibold">{v}</dd>
                </div>
              ))}
            </dl>

            {method === "momo" ? (
              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="text-sm font-semibold">
                  Send {bundle ? formatMoney(country, bundle.price) : ""} to:
                </p>
                <ul className="mt-3 space-y-2">
                  {country.momo.map((m) => (
                    <CopyRow key={m.label} label={m.label} value={m.value} />
                  ))}
                  <CopyRow label="Payment reference" value={reference} />
                </ul>
                <p className="mt-3 text-xs text-muted-foreground">
                  Use the reference above as the transfer note — payment is matched automatically.
                </p>
              </div>
            ) : null}

            {method === "paystack" ? (
              <Button
                className="h-12 w-full text-base"
                onClick={() => {
                  toast.success("Redirecting to secure Paystack checkout…");
                  window.open(
                    `https://paystack.com/pay/fastdata?reference=${encodeURIComponent(reference)}`,
                    "_blank",
                    "noopener,noreferrer",
                  );
                }}
              >
                Pay {bundle ? formatMoney(country, bundle.price) : ""} with Paystack
              </Button>
            ) : null}

            {method === "wallet" ? (
              <Button
                className="h-12 w-full text-base"
                onClick={() => toast.success("Order queued against your agent wallet balance")}
              >
                Pay from agent wallet
              </Button>
            ) : null}

            <Button asChild variant="whatsapp" className="h-14 w-full text-base">
              <a href={waLink(message ?? "")} target="_blank" rel="noopener noreferrer">
                Complete Order on WhatsApp
              </a>
            </Button>

            <Button
              variant="outline"
              className="h-11 w-full"
              onClick={() => {
                onOpenChange(false);
                onReceipt({
                  orderId: orderIdValue,
                  recipient: local,
                  item,
                  amount: bundle ? formatMoney(country, bundle.price) : "",
                  country: `${country.flag} ${country.name}`,
                  date: new Date().toLocaleString(),
                });
              }}
            >
              View digital receipt
            </Button>

            <Button asChild variant="outline" className="h-11 w-full">
              <Link to="/order/success" search={{ reference }}>
                Track payment confirmation
              </Link>
            </Button>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Change payment method
            </button>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
