import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { getOrderByReference } from "@/lib/orders.functions";
import { waLink } from "@/lib/fastdata";

const title = "Payment Confirmed — FastData Africa Order Status";
const description =
  "Live confirmation for your FastData Africa order. Once payment clears, your bundle or utility top-up is marked Paid & Processing automatically.";

export const Route = createFileRoute("/order/success")({
  validateSearch: (search) =>
    z.object({ reference: z.string().catch("") }).parse(search),
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: OrderSuccess,
  errorComponent: () => (
    <Fallback text="We couldn't load this order right now. Please try again shortly." />
  ),
  notFoundComponent: () => <Fallback text="That order reference was not found." />,
});

function Fallback({ text }: { text: string }) {
  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <p className="text-sm text-muted-foreground">{text}</p>
      <Button asChild className="mt-6">
        <Link to="/">Back to home</Link>
      </Button>
    </div>
  );
}

function OrderSuccess() {
  const { reference } = Route.useSearch();
  const fetchOrder = useServerFn(getOrderByReference);

  const { data, isLoading } = useQuery({
    queryKey: ["order", reference],
    enabled: reference.length > 0,
    queryFn: () => fetchOrder({ data: { reference } }),
    refetchInterval: (q) =>
      q.state.data && q.state.data.status !== "Pending Payment" ? false : 5000,
  });

  const paid = data?.status === "Paid & Processing" || data?.status === "Delivered";

  if (!reference) return <Fallback text="No order reference was provided." />;

  return (
    <div className="min-h-screen bg-secondary/40 px-4 py-10">
      <div className="mx-auto max-w-md rounded-3xl border border-border bg-card p-6 shadow-card">
        <div
          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full text-3xl ${
            paid ? "bg-whatsapp text-whatsapp-foreground" : "bg-secondary"
          }`}
        >
          {paid ? "✓" : "⏳"}
        </div>

        <h1 className="mt-4 text-center text-2xl font-extrabold">
          {paid ? "Payment confirmed" : "Awaiting payment confirmation"}
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {paid
            ? "Your payment was verified automatically. Your order is now Paid & Processing — no manual verification needed."
            : "This page updates by itself the moment your payment is verified. Keep it open."}
        </p>

        {isLoading ? (
          <p className="mt-6 text-center text-sm text-muted-foreground">Checking status…</p>
        ) : data ? (
          <dl className="mt-6 rounded-2xl border border-border bg-secondary p-4 text-sm">
            {[
              ["Status", data.status],
              ["Order ID", data.order_id],
              ["Payment reference", data.reference],
              ["Package / Service", data.item],
              ["Amount", `${data.currency} ${Number(data.amount).toLocaleString()}`],
              ["Recipient", data.recipient],
              ["Country", data.country],
              [
                "Date",
                new Date(data.paid_at ?? data.created_at).toLocaleString(),
              ],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3 py-1.5">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="text-right font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="mt-6 text-center text-sm text-muted-foreground">
            We have no record of reference {reference} yet.
          </p>
        )}

        <Button asChild variant="whatsapp" className="mt-5 h-14 w-full text-base">
          <a
            href={waLink(
              `FastData Africa — order status check.\nReference: ${reference}\nStatus: ${data?.status ?? "Pending"}`,
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            Send Receipt to WhatsApp (+233 50 366 0497)
          </a>
        </Button>
        <Button asChild variant="outline" className="mt-3 h-12 w-full">
          <Link to="/">Buy another bundle</Link>
        </Button>
      </div>
    </div>
  );
}
