import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isValidPhone, trackOrder, waLink, type OrderStatus } from "@/lib/fastdata";

const STATUS_STYLE: Record<OrderStatus, string> = {
  Delivered: "bg-whatsapp text-whatsapp-foreground",
  Processing: "bg-mtn text-mtn-foreground",
  "Pending Confirmation": "bg-telecel text-telecel-foreground",
};

export function OrderTracker() {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<ReturnType<typeof trackOrder> | null>(null);

  const check = () => {
    const clean = phone.replace(/[\s-]/g, "");
    if (!isValidPhone(clean)) {
      setResult(null);
      setError("Enter the recipient number used for the order.");
      return;
    }
    setError("");
    setResult(trackOrder(clean));
  };

  return (
    <section id="tracking" className="scroll-mt-20 px-4 py-8">
      <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <h2 className="text-lg font-bold">Order tracking</h2>
        <p className="text-sm text-muted-foreground">
          Enter the recipient phone number to check your delivery status.
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
                onKeyDown={(e) => e.key === "Enter" && check()}
                className="h-12"
              />
              <Button className="h-12 px-5" onClick={check}>
                Track
              </Button>
            </div>
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          {result ? (
            <div className="rounded-2xl border border-border bg-secondary p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground">Reference {result.ref}</span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_STYLE[result.status]}`}
                >
                  {result.status}
                </span>
              </div>
              <p className="mt-3 text-sm">{result.note}</p>
              <Button asChild variant="whatsapp" className="mt-3 h-11 w-full">
                <a
                  href={waLink(
                    `Hello FastData Africa! Please check my order for ${phone.replace(/[\s-]/g, "")} (Ref ${result.ref}).`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ask support about this order
                </a>
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
