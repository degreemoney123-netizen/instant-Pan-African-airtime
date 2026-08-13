import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { waLink, isValidGhNumber } from "@/lib/fastdata";

type PlanId = "starter" | "vip";

const PLANS: {
  id: PlanId;
  name: string;
  fee: number;
  income: string;
  perks: string[];
}[] = [
  {
    id: "starter",
    name: "Starter Agent",
    fee: 50,
    income: "GH₵ 1,000 – GH₵ 1,800",
    perks: [
      "Standard wholesale discount on MTN, Telecel & AT",
      "Agent price list + order channel",
      "Regular processing queue",
    ],
  },
  {
    id: "vip",
    name: "VIP / Mega Agent",
    fee: 100,
    income: "GH₵ 2,500 – GH₵ 3,000+",
    perks: [
      "Maximum bulk discount rates",
      "Priority fast processing",
      "Dedicated support line + resale training",
    ],
  },
];

export function VendorSection() {
  const [plan, setPlan] = useState<PlanId>("vip");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");

  const selected = PLANS.find((p) => p.id === plan)!;

  const register = () => {
    if (name.trim().length < 2) return setError("Please enter your full name.");
    if (!isValidGhNumber(phone.replace(/\s+/g, "")))
      return setError("Enter a valid 10-digit MoMo number, e.g. 0593660497");
    setError("");
    const msg = `Hello! I want to register as a FastData GH agent.\nPlan: ${selected.name} (Registration Fee GH₵ ${selected.fee})\nName: ${name.trim().slice(0, 80)}\nMoMo Number: ${phone.replace(/\s+/g, "")}\nLocation: ${location.trim().slice(0, 80) || "N/A"}\nI'm ready to pay the registration fee now.`;
    window.open(waLink(msg), "_blank", "noopener,noreferrer");
  };

  return (
    <section id="vendor" className="scroll-mt-20 px-4 py-10">
      <div className="rounded-3xl bg-hero p-5 text-center shadow-pop">
        <span className="inline-flex rounded-full bg-mtn px-3 py-1 text-xs font-bold text-mtn-foreground">
          Become a Vendor / Agent
        </span>
        <h2 className="mt-3 text-2xl font-extrabold text-primary-foreground">
          Earn GH₵ 2,500 – GH₵ 3,000+ Monthly as an Authorized Data Agent!
        </h2>
        <p className="mt-3 rounded-2xl bg-whatsapp/20 px-4 py-3 text-sm font-semibold text-primary-foreground">
          Quick maths: Sell 15–20 bundles daily = GH₵ 100+ daily profit!
        </p>
      </div>

      <div className="mt-5 space-y-4">
        {PLANS.map((p) => (
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
                  Registration Fee: GH₵ {p.fee} (one-time)
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
          Selected plan: {selected.name} — GH₵ {selected.fee}
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
              placeholder="Kwame Mensah"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="v-phone">MoMo number</Label>
            <Input
              id="v-phone"
              inputMode="numeric"
              maxLength={13}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-12"
              placeholder="059XXXXXXX"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="v-loc">Location (optional)</Label>
            <Input
              id="v-loc"
              maxLength={80}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="h-12"
              placeholder="Kumasi"
            />
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button variant="whatsapp" className="h-14 w-full text-base" onClick={register}>
            Pay Fee &amp; Register Now — GH₵ {selected.fee}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Pay by MTN MoMo / Telecel Cash after confirming on WhatsApp.
          </p>
        </div>
      </div>
    </section>
  );
}
