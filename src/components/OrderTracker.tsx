import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getOrdersByRecipient } from "@/lib/orders.functions";
import { TRACK_STEPS, isValidPhone, stepIndexForStatus, waLink } from "@/lib/fastdata";

type Row = {
  reference: string;
  order_id: string;
  item: string;
  amount: number;
  currency: string;
  country: string;
  status: string;
  paid_at: string | null;
  created_at: string;
};

function Timeline({ current }: { current: number }) {
  return (
    <ol className="mt-4 space-y-3">
      {TRACK_STEPS.map((label, i) => {
        const done = i <= current;
        return (
          <li key={label} className="flex items-start gap-3">
            <span
              className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                done ? "bg-whatsapp text-whatsapp-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {done ? <Check className="size-3.5" /> : i + 1}
            </span>
            <span className="flex-1">
              <span className={`block text-sm font-semibold ${done ? "" : "text-muted-foreground"}`}>
                {label}
              </span>
              {i === current ? (
                <span className="block text-xs text-muted-foreground">Current stage</span>
              ) : null}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export function OrderTracker() {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<Row[] | null>(null);
  const lookup = useServerFn(getOrdersByRecipient);

  const check = async () => {
    const clean = phone.replace(/[\s-]/g, "");
    if (!isValidPhone(clean)) {
      setRows(null);
      setError("Enter the recipient number used for the order.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const result = (await lookup({ data: { recipient: clean } })) as Row[];
      setRows(result);
      if (result.length === 0) toast("No orders found for that number yet");
      else toast.success(`Found ${result.length} order${result.length > 1 ? "s" : ""}`);
    } catch {
      setError("We could not reach the tracking service. Please try again.");
      toast.error("Tracking lookup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="tracking" className="scroll-mt-20 px-4 py-8">
      <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <h2 className="text-lg font-bold">Order tracking</h2>
        <p className="text-sm text-muted-foreground">
          Enter the recipient phone number to see your live delivery timeline.
        </p>

        <div className="mt-4 space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="track-phone">Recipient mobile number</Label>
            <div className="flex gap-2">
              <Input
                id="track-phone"
                inputMode="tel"
                maxLength={15}
                placeholder="e.g. 059XXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && void check()}
                className="h-12"
              />
              <Button className="h-12 px-5" onClick={() => void check()} disabled={loading}>
                {loading ? "…" : "Track"}
              </Button>
            </div>
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          {rows && rows.length === 0 ? (
            <div className="rounded-2xl border border-border bg-secondary p-4 text-sm">
              <p className="font-semibold">No orders found for {phone.replace(/[\s-]/g, "")}</p>
              <p className="mt-1 text-muted-foreground">
                If you have just paid, wait a minute and try again — or message support below.
              </p>
              <Button asChild variant="whatsapp" className="mt-3 h-11 w-full">
                <a
                  href={waLink(
                    `Hello FastData Africa! I cannot find my order for ${phone.replace(/[\s-]/g, "")}.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ask support about this order
                </a>
              </Button>
            </div>
          ) : null}

          {rows?.map((row) => (
            <div key={row.reference} className="rounded-2xl border border-border bg-secondary p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold">{row.item}</span>
                <span className="rounded-full bg-card px-3 py-1 text-xs font-bold">
                  {row.status}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Ref {row.reference} · {row.currency} {row.amount} ·{" "}
                {new Date(row.created_at).toLocaleString()}
              </p>

              <Timeline current={stepIndexForStatus(row.status)} />

              <Button asChild variant="whatsapp" className="mt-3 h-11 w-full">
                <a
                  href={waLink(
                    `Hello FastData Africa! Please check my order ${row.reference} for ${phone.replace(/[\s-]/g, "")}.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ask support about this order
                </a>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
