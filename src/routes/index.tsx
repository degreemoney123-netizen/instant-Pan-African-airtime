import { useState } from "react";
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
import { NETWORKS, MOMO, bundlesFor, waLink, type Bundle, type NetworkId } from "@/lib/fastdata";

const title = "FastData GH — Instant Non-Expiry Data Bundles";
const description =
  "Buy cheap non-expiry MTN, Telecel and AT data bundles in Ghana with automated WhatsApp delivery. Become an agent and earn GH₵ 2,500+ monthly.";

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

const buyVariant: Record<NetworkId, "mtn" | "telecel" | "at"> = {
  mtn: "mtn",
  telecel: "telecel",
  at: "at",
};

function Index() {
  const [net, setNet] = useState<NetworkId>("mtn");
  const [bundle, setBundle] = useState<Bundle | null>(null);
  const [open, setOpen] = useState(false);

  const active = NETWORKS.find((n) => n.id === net)!;

  return (
    <div className="min-h-screen pb-28">
      <header className="bg-hero px-4 pt-8 pb-12 text-primary-foreground">
        <div className="mx-auto max-w-md">
          <div className="flex items-center justify-between">
            <span className="text-lg font-extrabold tracking-tight">FastData GH</span>
            <span className="animate-pulse rounded-full bg-whatsapp px-3 py-1 text-xs font-bold text-whatsapp-foreground">
              Automated Delivery
            </span>
          </div>
          <h1 className="mt-6 text-3xl font-extrabold leading-tight">
            Instant Data Bundles <span className="text-mtn">•</span> Non-Expiry
          </h1>
          <p className="mt-3 text-sm text-primary-foreground/80">
            MTN, Telecel and AT bundles delivered in minutes. Pay with MoMo, confirm on WhatsApp,
            data lands on the number you choose.
          </p>
          <div className="mt-5 flex gap-2 text-xs font-semibold">
            <span className="rounded-full bg-primary-foreground/10 px-3 py-1.5">No expiry</span>
            <span className="rounded-full bg-primary-foreground/10 px-3 py-1.5">Agent prices</span>
            <span className="rounded-full bg-primary-foreground/10 px-3 py-1.5">24/7 support</span>
          </div>
        </div>
      </header>

      <main className="mx-auto -mt-6 max-w-md">
        <section className="px-4">
          <div className="grid grid-cols-3 gap-2 rounded-2xl bg-card p-2 shadow-card">
            {NETWORKS.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => setNet(n.id)}
                className={`rounded-xl py-3 text-sm font-bold transition ${
                  net === n.id ? n.accent : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                {n.short}
              </button>
            ))}
          </div>

          <h2 className="mt-6 text-xl font-bold">{active.name} non-expiry bundles</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {bundlesFor(net).map((b) => (
              <article
                key={b.size}
                className="flex flex-col rounded-2xl border border-border bg-card p-4 shadow-card"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-extrabold">{b.size}</span>
                  {b.tag ? (
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${active.accent}`}>
                      {b.tag}
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Non-expiry · {active.short}</p>
                <p className="mt-3 text-xl font-bold">GH₵ {b.price}</p>
                <Button
                  variant={buyVariant[net]}
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
            <h2 className="text-lg font-bold">MoMo payment details</h2>
            <p className="text-sm text-muted-foreground">
              Send payment to any of these, then share the screenshot on WhatsApp.
            </p>
            <ul className="mt-4 space-y-2">
              {MOMO.map((m) => (
                <li key={m.label} className="flex justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">{m.label}</span>
                  <span className="font-semibold">{m.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <VendorSection />

        <section className="px-4 pb-8">
          <h2 className="text-xl font-bold">How it works &amp; FAQ</h2>
          <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>1. Pick your network and bundle size.</li>
            <li>2. Enter the recipient number and confirm the network.</li>
            <li>3. Pay via MoMo, then tap Complete Order on WhatsApp.</li>
          </ol>
          <Accordion type="single" collapsible className="mt-4">
            <AccordionItem value="a">
              <AccordionTrigger>How fast is delivery?</AccordionTrigger>
              <AccordionContent>
                Most orders are processed automatically within 1–15 minutes. Bulk orders may take
                slightly longer during peak hours.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="b">
              <AccordionTrigger>Do the bundles really never expire?</AccordionTrigger>
              <AccordionContent>
                Yes. All listed bundles are non-expiry — the data stays on the number until it is
                fully used.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="c">
              <AccordionTrigger>Can I send data to another person?</AccordionTrigger>
              <AccordionContent>
                Absolutely. Just enter their number as the recipient during checkout.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="d">
              <AccordionTrigger>What does the agent registration fee cover?</AccordionTrigger>
              <AccordionContent>
                A one-time GH₵ 50 (Starter) or GH₵ 100 (VIP) fee unlocks wholesale pricing, your
                agent order channel and resale support.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <footer className="px-4 pb-10 text-center text-xs text-muted-foreground">
          FastData GH · Accra, Ghana · WhatsApp +233 50 366 0497
        </footer>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 p-3 backdrop-blur">
        <Button asChild variant="whatsapp" className="mx-auto flex h-14 w-full max-w-md text-base">
          <a
            href={waLink("Hello FastData GH! I need help with a data bundle order.")}
            target="_blank"
            rel="noopener noreferrer"
          >
            Chat with Support on WhatsApp
          </a>
        </Button>
      </div>

      <OrderDialog open={open} onOpenChange={setOpen} bundle={bundle} network={net} />
    </div>
  );
}
