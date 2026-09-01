import { createFileRoute, Link } from "@tanstack/react-router";
import { ContactForm } from "@/components/ContactForm";
import { SiteFooter } from "@/components/SiteFooter";
import {
  SOCIAL_LINKS,
  SUPPORT_EMAIL,
  SUPPORT_PHONE,
  SUPPORT_PHONE_ALT,
  waLink,
} from "@/lib/fastdata";

const title = "Contact Us & Help Center — FastData Africa";
const description =
  "Reach FastData Africa 24/7 by live chat, WhatsApp, email or phone. Send a support request about bundles, payments, refunds or the agent programme.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="min-h-screen pb-16">
      <header className="bg-hero px-4 pb-10 pt-6 text-primary-foreground">
        <div className="mx-auto max-w-md">
          <Link to="/" className="text-xs font-bold text-primary-foreground/80">
            ← Back to home
          </Link>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight">Contact Us &amp; Help Center</h1>
          <p className="mt-2 text-sm text-primary-foreground/80">
            24/7 Live Support across West, East, Southern and North Africa.
          </p>
        </div>
      </header>

      <main className="mx-auto -mt-6 max-w-md px-4">
        <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <h2 className="text-lg font-bold">Send us a message</h2>
          <div className="mt-3">
            <ContactForm />
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-card">
          <h2 className="text-lg font-bold">Direct support lines</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Support hours</dt>
              <dd className="font-semibold">24/7 Live Support</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Email</dt>
              <dd className="font-semibold">
                <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">WhatsApp</dt>
              <dd className="font-semibold">
                <a href={waLink("Hello FastData Africa support!")} target="_blank" rel="noreferrer">
                  {SUPPORT_PHONE}
                </a>
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Business line</dt>
              <dd className="font-semibold">
                <a href={`tel:${SUPPORT_PHONE_ALT.replace(/\s/g, "")}`}>{SUPPORT_PHONE_ALT}</a>
              </dd>
            </div>
          </dl>

          <h3 className="mt-5 text-sm font-bold">Official channels</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold"
              >
                {s.label}
              </a>
            ))}
          </div>
        </section>

        <SiteFooter />
      </main>
    </div>
  );
}
