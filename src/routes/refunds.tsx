import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";

const title = "Refund Policy — FastData Africa";
const description =
  "When FastData Telecom Enterprise refunds data bundles, utility top-ups and agent registration fees, and how to request a refund.";

export const Route = createFileRoute("/refunds")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Refunds,
});

function Refunds() {
  return (
    <LegalPage
      title="Refund Policy"
      intro="Clear rules on when money is returned and how long it takes."
      sections={[
        {
          heading: "Failed or undelivered orders",
          body: "If a paid bundle, electricity or TV top-up is not delivered, we re-process it at no cost or refund the full amount to the paying Mobile Money wallet within 24–72 hours.",
        },
        {
          heading: "Wrong number supplied",
          body: "Once a bundle is delivered to the number you provided, it cannot be recalled by the operator, so it is not refundable. Please confirm the recipient number before paying.",
        },
        {
          heading: "Duplicate payments",
          body: "Accidental duplicate payments are refunded in full once verified against our transaction log, usually within 24 hours.",
        },
        {
          heading: "Agent registration fees",
          body: "Registration fees are refundable within 7 days if your agent account has not been activated and no wholesale order has been placed.",
        },
        {
          heading: "How to request a refund",
          body: "Send your Order ID, recipient number and payment receipt to WhatsApp +233 503660497 or support@fastdataafrica.com. Refund decisions are communicated within 24 hours.",
        },
      ]}
    />
  );
}
