import { useEffect, useState } from "react";
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
import { formatMoney, isValidPhone, makeOrderId, waLink, type Country } from "@/lib/fastdata";
import type { Receipt } from "@/components/ReceiptModal";

type Service = {
  id: string;
  icon: string;
  name: string;
  blurb: string;
  accountLabel: string;
  accountPlaceholder: string;
};

const SERVICES: Service[] = [
  {
    id: "ecg",
    icon: "⚡",
    name: "ECG Electricity Top-Up",
    blurb: "Buy prepaid power credits instantly.",
    accountLabel: "Meter number",
    accountPlaceholder: "e.g. P00123456789",
  },
  {
    id: "tv",
    icon: "📺",
    name: "TV Subscriptions",
    blurb: "DSTV, GOtv and StarTimes instant renewal.",
    accountLabel: "Smartcard / IUC number",
    accountPlaceholder: "e.g. 7031234567",
  },
  {
    id: "water",
    icon: "💧",
    name: "Water Bills",
    blurb: "Ghana Water (GWCL) payment portal.",
    accountLabel: "GWCL account number",
    accountPlaceholder: "e.g. 0301234567",
  },
  {
    id: "branding",
    icon: "🎨",
    name: "Business Branding",
    blurb: "Vendor logo & promotional flyer design packages.",
    accountLabel: "Business name",
    accountPlaceholder: "e.g. Ama Data Hub",
  },
];

export function UtilitySection({
  country,
  onReceipt,
}: {
  country: Country;
  onReceipt: (r: Receipt) => void;
}) {
  const [service, setService] = useState<Service | null>(null);
  const [account, setAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (service) {
      setAccount("");
      setAmount("");
      setPhone("");
      setError("");
    }
  }, [service]);

  const validate = () => {
    if (account.trim().length < 3) {
      setError(`Enter a valid ${service?.accountLabel.toLowerCase()}.`);
      return null;
    }
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      setError(`Enter the amount in ${country.currency}.`);
      return null;
    }
    if (!isValidPhone(phone.replace(/[\s-]/g, ""))) {
      setError("Enter a valid customer phone number.");
      return null;
    }
    setError("");
    return value;
  };

  const message = (value: number) =>
    `Hello! I want to pay for ${service?.name}.\n${service?.accountLabel}: ${account.trim().slice(0, 60)}\nAmount: ${formatMoney(country, value)}\nCustomer Phone Number: ${phone.replace(/[\s-]/g, "")}\nCountry: ${country.name} ${country.flag}`;

  const receiptFor = (value: number): Receipt => ({
    orderId: makeOrderId("UT", account + phone),
    recipient: phone.replace(/[\s-]/g, ""),
    item: `${service?.name} — ${account.trim().slice(0, 40)}`,
    amount: formatMoney(country, value),
    country: `${country.flag} ${country.name}`,
    date: new Date().toLocaleString(),
  });

  const payNow = () => {
    const value = validate();
    if (value === null) return;
    onReceipt(receiptFor(value));
    setService(null);
  };

  const orderOnWhatsApp = () => {
    const value = validate();
    if (value === null) return;
    window.open(waLink(message(value)), "_blank", "noopener,noreferrer");
    onReceipt(receiptFor(value));
    setService(null);
  };

  return (
    <section id="utilities" className="scroll-mt-20 px-4 py-8">
      <h2 className="text-xl font-bold">Local utility &amp; daily services</h2>
      <p className="text-sm text-muted-foreground">
        Pay everyday bills in {country.currency} with Paystack or Mobile Money.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {SERVICES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setService(s)}
            className="flex h-full flex-col rounded-2xl border border-border bg-card p-4 text-left shadow-card transition hover:border-at"
          >
            <span className="text-2xl">{s.icon}</span>
            <span className="mt-2 text-sm font-bold leading-tight">{s.name}</span>
            <span className="mt-1 text-xs text-muted-foreground">{s.blurb}</span>
          </button>
        ))}
      </div>

      <Dialog open={!!service} onOpenChange={(v) => !v && setService(null)}>
        <DialogContent className="max-w-[92vw] rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {service?.icon} {service?.name}
            </DialogTitle>
            <DialogDescription>{service?.blurb}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="u-account">{service?.accountLabel}</Label>
              <Input
                id="u-account"
                maxLength={40}
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                placeholder={service?.accountPlaceholder}
                className="h-12"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="u-amount">Amount in {country.currency}</Label>
              <Input
                id="u-amount"
                inputMode="decimal"
                maxLength={9}
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                placeholder={`e.g. 100 (${country.symbol})`}
                className="h-12"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="u-phone">Customer phone number</Label>
              <Input
                id="u-phone"
                inputMode="tel"
                maxLength={15}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 059XXXXXXX"
                className="h-12"
              />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}

            <div className="space-y-2">
              <Button className="h-12 w-full text-base" onClick={payNow}>
                Pay via MoMo / Paystack
              </Button>
              <Button
                variant="whatsapp"
                className="h-14 w-full text-base"
                onClick={orderOnWhatsApp}
              >
                Order via WhatsApp (+233 50 366 0497)
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
