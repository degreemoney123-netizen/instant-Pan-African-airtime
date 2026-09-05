import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { waLink } from "@/lib/fastdata";

export type Receipt = {
  orderId: string;
  recipient: string;
  item: string;
  amount: string;
  country: string;
  date: string;
};

export function ReceiptModal({
  receipt,
  onOpenChange,
}: {
  receipt: Receipt | null;
  onOpenChange: (v: boolean) => void;
}) {
  const message = receipt
    ? `FastData Africa — Digital Receipt\nOrder ID: ${receipt.orderId}\nRecipient: ${receipt.recipient}\nPackage/Tier: ${receipt.item}\nAmount: ${receipt.amount}\nCountry: ${receipt.country}\nDate: ${receipt.date}`
    : "";

  return (
    <Dialog open={!!receipt} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[92vw] rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Digital order receipt</DialogTitle>
          <DialogDescription>Keep this reference for your delivery tracking.</DialogDescription>
        </DialogHeader>

        {receipt ? (
          <div className="space-y-4">
            <dl className="rounded-2xl border border-border bg-secondary p-4 text-sm">
              {[
                ["Order ID", receipt.orderId],
                ["Recipient number", receipt.recipient],
                ["Package / Tier", receipt.item],
                ["Amount", receipt.amount],
                ["Country", receipt.country],
                ["Date", receipt.date],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3 py-1.5">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="text-right font-semibold">{v}</dd>
                </div>
              ))}
            </dl>

            <Button asChild variant="whatsapp" className="h-14 w-full text-base">
              <a href={waLink(message)} target="_blank" rel="noopener noreferrer">
                Send Receipt to WhatsApp (+233 503660497)
              </a>
            </Button>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
