import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";

const title = "Privacy Policy — FastData Africa";
const description =
  "How FastData Telecom Enterprise collects, uses and protects phone numbers, payment references and agent details across African markets.";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="What we collect, why we collect it, and how it is protected."
      sections={[
        {
          heading: "Information we collect",
          body: "Recipient phone numbers, meter or account numbers, order amounts, selected country and network, and — for agents — name, location and chosen plan. We do not store card details; card payments are handled by Paystack.",
        },
        {
          heading: "How we use it",
          body: "Solely to deliver your order, confirm payment, provide support on WhatsApp, and issue receipts. We do not sell personal data to third parties.",
        },
        {
          heading: "Sharing",
          body: "Data is shared only with the network operator or utility provider required to fulfil your order, and with our payment processors (Mobile Money operators and Paystack).",
        },
        {
          heading: "Security",
          body: "All traffic is protected with 256-bit SSL encryption. Access to order records is limited to authorised support staff.",
        },
        {
          heading: "Retention and your rights",
          body: "Order records are retained for accounting and dispute resolution. You may request a copy or deletion of your data by emailing support@fastdataafrica.com.",
        },
      ]}
    />
  );
}
