import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";

const title = "Terms of Service — FastData Africa";
const description =
  "Service terms for FastData Telecom Enterprise: data bundle delivery, utility payments, agent registration and acceptable use across Africa.";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <LegalPage
      title="Terms of Service"
      intro="The rules that govern your use of FastData Telecom Enterprise services."
      sections={[
        {
          heading: "1. Services",
          body: "FastData Telecom Enterprise resells mobile data bundles, electricity and TV top-ups, utility bill payments and branding services across supported African markets. Availability depends on the network operator and your selected country.",
        },
        {
          heading: "2. Orders and delivery",
          body: "Orders are processed automatically, typically within 1–15 minutes. You are responsible for supplying the correct recipient number, meter or account number. Delivery to a wrong number supplied by you cannot be reversed.",
        },
        {
          heading: "3. Payments",
          body: "Payments are made in the currency of the selected country via Mobile Money or Paystack. An order is only fulfilled after payment is confirmed and a receipt is submitted where requested.",
        },
        {
          heading: "4. Agents and vendors",
          body: "Agent registration fees are one-time and grant access to wholesale pricing. Income figures shown on the site are illustrative estimates based on active agents and are not guaranteed earnings.",
        },
        {
          heading: "5. Acceptable use",
          body: "You may not use the platform for fraud, resale of stolen credit, money laundering or any activity that breaches operator terms. Accounts involved in such activity are terminated without refund.",
        },
        {
          heading: "6. Changes",
          body: "Prices, bundles and terms may change as operator rates change. Continued use of the platform after an update means you accept the revised terms.",
        },
      ]}
    />
  );
}
