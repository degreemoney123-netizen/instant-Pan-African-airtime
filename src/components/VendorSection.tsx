import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CountrySelect } from "@/components/CountrySelect";
import { waLink, isValidPhone, formatMoney, makeOrderId, type Country } from "@/lib/fastdata";

type PlanId = "starter" | "vip";

export function VendorSection({
  country,
  onCountryChange,
  onReceipt,
}: {
  country: Country;
  onCountryChange: (c: Country) => void;
  onReceipt: (r: {
    orderId: string;
    recipient: string;
    item: string;
    amount: string;
    country: string;
    date: string;
  }) => void;
}) {
  const [plan, setPlan] = useState<PlanId>("vip");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");

  const plans = [
    {
      id: "starter" as const,
      name: "Starter Agent",
      fee: country.vendor.starter,
      income: country.vendor.starterIncome,
      perks: [
        `Standard wholesale discount on all ${country.name} networks`,
        "Agent price list + order channel",
        "Regular processing queue",
      ],
    },
    {
      id: "vip" as const,
      name: "VIP / Mega Agent",
      fee: country.vendor.vip,
      income: country.vendor.vipIncome,
      perks: [
        "Maximum bulk discount rates",
        "Priority fast processing",
        "Dedicated support line + resale training",
      ],
    },
  ];

  const selected = plans.find((p) => p.id === plan)!;

  const register = () => {
    if (name.trim().length < 2) return setError("Please enter your full name.");
    if (!isValidPhone(phone.replace(/[\s-]/g, "")))
      return setError("Enter a valid mobile money number.");
    setError("");
    const msg = `Hello! I want to register as a FastData Africa agent.\nCountry: ${country.name} ${country.flag}\nPlan: ${selected.name} (Registration Fee ${formatMoney(country, selected.fee)})\nName: ${name.trim().slice(0, 80)}\nMobile Money Number: ${phone.replace(/[\s-]/g, "")}\nLocation: ${location.trim().slice(0, 80) || "N/A"}\nI'm ready to pay the registration fee in ${country.currency} now.`;
    window.open(waLink(msg), "_blank", "noopener,noreferrer");
    onReceipt({
      orderId: makeOrderId("VN", phone.replace(/[\s-]/g, "")),
      recipient: phone.replace(/[\s-]/g, ""),
      item: `${selected.name} registration`,
      amount: formatMoney(country, selected.fee),
      country: `${country.flag} ${country.name}`,
      date: new Date().toLocaleString(),
    });
  };

  return (
    <section id="vendor" className="scroll-mt-20 px-4 py-10">
      <div className="rounded-3xl bg-hero p-5 text-center shadow-pop">
        <span className="inline-flex rounded-full bg-mtn px-3 py-1 text-xs font-bold text-mtn-foreground">
          Global Vendor Portal
        </span>
        <h2 className="mt-3 text-2xl font-extrabold text-primary-foreground">
          Earn {country.vendor.vipIncome} monthly as an Authorized Data Agent in {country.name}{" "}
          {country.flag}
        </h2>
        <p className="mt-3 rounded-2xl bg-whatsapp/20 px-4 py-3 text-sm font-semibold text-primary-foreground">
          {country.vendor.daily}
        </p>
        <div className="mt-4">
          <CountrySelect
            value={country}
            onChange={onCountryChange}
            className="h-12 w-full rounded-xl bg-card"
          />
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {plans.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPlan(p.id)}
            className={`block w-full rounded-2xl border-2 bg-card p-5 text-left shadow-card transition ${
              plan === p.id ? "border-at" : "border-border"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold">{p.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Registration fee: {formatMoney(country, p.fee)} (one-time)
                </p>
              </div>
              {p.id === "vip" ? (
                <span className="rounded-full bg-telecel px-2 py-1 text-[11px] font-bold text-telecel-foreground">
                  Most profitable
                </span>
              ) : null}
            </div>
            <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
              {p.perks.map((perk) => (
                <li key={perk}>• {perk}</li>
              ))}
            </ul>
            <p className="mt-3 text-sm font-bold">
              Estimated monthly income: <span className="text-at">{p.income}</span>
            </p>
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-card">
        <h3 className="text-lg font-bold">Vendor registration</h3>
        <p className="text-sm text-muted-foreground">
          {country.flag} {country.name} · {selected.name} — {formatMoney(country, selected.fee)}
        </p>
        <div className="mt-4 space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="v-name">Full name</Label>
            <Input
              id="v-name"
              maxLength={80}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12"
              placeholder="Your full name"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="v-phone">Mobile money number</Label>
            <Input
              id="v-phone"
              inputMode="tel"
              maxLength={15}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-12"
              placeholder="Your mobile number"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="v-loc">City (optional)</Label>
            <Input
              id="v-loc"
              maxLength={80}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="h-12"
              placeholder="City"
            />
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button variant="whatsapp" className="h-14 w-full text-base" onClick={register}>
            Pay Fee &amp; Register Now — {formatMoney(country, selected.fee)}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Pay by Paystack or local Mobile Money in {country.currency} after confirming on
            WhatsApp.
          </p>
        </div>
      </div>
    </section>
  );
}
