import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { OrderDialog } from "@/components/OrderDialog";
import { VendorSection } from "@/components/VendorSection";
import { CountryRegionBar } from "@/components/CountryRegionBar";
import { OrderTracker } from "@/components/OrderTracker";
import { UtilitySection } from "@/components/UtilitySection";
import { SalesTicker } from "@/components/SalesTicker";
import { TrustBadges } from "@/components/TrustBadges";
import { Testimonials } from "@/components/Testimonials";
import { SiteFooter } from "@/components/SiteFooter";
import { ReceiptModal, type Receipt } from "@/components/ReceiptModal";
import {
  ACCENT_BG,
  ACCENT_BUTTON,
  COUNTRIES,
  bundlesFor,
  formatMoney,
  waLink,
  type Bundle,
  type Country,
} from "@/lib/fastdata";

const title = "FastData Africa — Instant Data Bundles Across Africa";
const description =
  "Buy non-expiry mobile data in Ghana, Nigeria, Kenya, South Africa, Egypt and more. Local currency Paystack & Mobile Money checkout, plus a pan-African agent programme.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Index,
});

function Index() {
  const [country, setCountry] = useState<Country>(COUNTRIES[0] as Country);
  const [netId, setNetId] = useState(country.networks[0]!.id);
  const [bundle, setBundle] = useState<Bundle | null>(null);
  const [open, setOpen] = useState(false);
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  const netIndex = Math.max(
    0,
    country.networks.findIndex((n) => n.id === netId),
  );
  const active = country.networks[netIndex]!;
  const bundles = useMemo(() => bundlesFor(country, netIndex), [country, netIndex]);

  const changeCountry = (c: Country) => {
    setCountry(c);
    setNetId(c.networks[0]!.id);
  };

  return (
    <div className="min-h-screen pb-28">
      <header className="bg-hero px-4 pt-5 pb-12 text-primary-foreground">
        <div className="mx-auto max-w-md">
          <div className="flex items-center justify-between gap-2">
            <span className="text-lg font-extrabold tracking-tight">FastData Africa</span>
            <a
              href="#tracking"
              className="rounded-full border border-primary-foreground/30 px-3 py-1 text-xs font-bold"
            >
              Track order
            </a>
            <span className="animate-pulse rounded-full bg-whatsapp px-3 py-1 text-xs font-bold text-whatsapp-foreground">
              Automated Delivery
            </span>
          </div>

          <div className="mt-4">
            <CountryRegionBar country={country} onChange={changeCountry} />
          </div>


          <h1 className="mt-6 text-3xl font-extrabold leading-tight">
            Instant Data Bundles <span className="text-mtn">•</span> Non-Expiry
          </h1>
          <p className="mt-3 text-sm text-primary-foreground/80">
            Pan-African data delivery in {COUNTRIES.length} countries. Prices in{" "}
            {country.currency}, paid with Paystack or local Mobile Money.
          </p>
          <p className="mt-4 inline-flex rounded-full bg-mtn px-3 py-1.5 text-xs font-bold text-mtn-foreground">
            Now Supporting ECG Power, TV Subscriptions &amp; Local Utility Bills!
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-full bg-primary-foreground/10 px-3 py-1.5">No expiry</span>
            <span className="rounded-full bg-primary-foreground/10 px-3 py-1.5">
              Local currency
            </span>
            <span className="rounded-full bg-primary-foreground/10 px-3 py-1.5">24/7 support</span>
          </div>
        </div>
      </header>

      <main className="mx-auto -mt-6 max-w-md">
        <section className="px-4">
          <div className="flex gap-2 overflow-x-auto rounded-2xl bg-card p-2 shadow-card">
            {country.networks.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => setNetId(n.id)}
                className={`flex-1 whitespace-nowrap rounded-xl px-3 py-3 text-sm font-bold transition ${
                  netId === n.id ? ACCENT_BG[n.accent] : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                {n.short}
              </button>
            ))}
          </div>

          <h2 className="mt-6 text-xl font-bold">{active.name} non-expiry bundles</h2>
          <p className="text-sm text-muted-foreground">
            Prices shown in {country.currency} ({country.symbol})
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {bundles.map((b) => (
              <article
                key={b.size}
                className="flex flex-col rounded-2xl border border-border bg-card p-4 shadow-card"
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-2xl font-extrabold">{b.size}</span>
                  {b.tag ? (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${ACCENT_BG[active.accent]}`}
                    >
                      {b.tag}
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Non-expiry · {active.short}
                </p>
                <p className="mt-3 text-lg font-bold">{formatMoney(country, b.price)}</p>
                <Button
                  variant={ACCENT_BUTTON[active.accent]}
                  className="mt-3 h-11 w-full"
                  onClick={() => {
                    setBundle(b);
                    setOpen(true);
                  }}
                >
                  Buy Package
                </Button>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 px-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h2 className="text-lg font-bold">
              Payment options in {country.flag} {country.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              Checkout auto-adjusts to {country.currency} for Paystack and Mobile Money.
            </p>
            <ul className="mt-4 space-y-2">
              {country.momo.map((m) => (
                <li key={m.label} className="flex justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">{m.label}</span>
                  <span className="font-semibold">{m.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <TrustBadges />

        <UtilitySection country={country} onReceipt={setReceipt} />

        <OrderTracker />

        <VendorSection country={country} onCountryChange={changeCountry} onReceipt={setReceipt} />

        <Testimonials />

        <section className="mt-8 px-4 pb-8">
          <h2 className="text-xl font-bold">How it works &amp; FAQ</h2>
          <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>1. Pick your country, network and bundle size.</li>
            <li>2. Enter the recipient number and confirm the network.</li>
            <li>3. Pay in your local currency, then confirm on WhatsApp.</li>
          </ol>
          <Accordion type="single" collapsible className="mt-4">
            <AccordionItem value="a">
              <AccordionTrigger>Which countries are supported?</AccordionTrigger>
              <AccordionContent>
                {COUNTRIES.map((c) => `${c.flag} ${c.name}`).join(", ")} — with more African
                markets added every month.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="b">
              <AccordionTrigger>How fast is delivery?</AccordionTrigger>
              <AccordionContent>
                Most orders are processed automatically within 1–15 minutes, in every country we
                serve.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="c">
              <AccordionTrigger>What currency am I charged in?</AccordionTrigger>
              <AccordionContent>
                Always the currency of the country you select — {country.currency} right now. No
                hidden conversion at checkout.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="d">
              <AccordionTrigger>Can I become an agent outside Ghana?</AccordionTrigger>
              <AccordionContent>
                Yes. The vendor portal supports agents in every listed country, with local
                registration fees and local earnings potential.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <SiteFooter />
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 p-3 backdrop-blur">
        <Button asChild variant="whatsapp" className="mx-auto flex h-14 w-full max-w-md text-base">
          <a
            href={waLink(
              `Hello FastData Africa! I need help with a data bundle order in ${country.name}.`,
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            Chat with Support on WhatsApp
          </a>
        </Button>
      </div>

      <OrderDialog
        open={open}
        onOpenChange={setOpen}
        bundle={bundle}
        country={country}
        network={active}
        onReceipt={setReceipt}
      />

      <ReceiptModal receipt={receipt} onOpenChange={(v) => !v && setReceipt(null)} />
      <SalesTicker />
    </div>
  );
}
