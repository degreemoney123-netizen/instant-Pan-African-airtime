import { useState } from "react";
import { MessageCircle, Mail, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ContactForm } from "@/components/ContactForm";
import { SOCIAL_LINKS, SUPPORT_EMAIL, waLink } from "@/lib/fastdata";

export function SupportBar({ context }: { context?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 p-3 backdrop-blur">
        <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
          <Button asChild variant="whatsapp" className="h-12 flex-col gap-0.5 px-1 text-[11px] font-bold">
            <a
              href={waLink(context ?? "Hello FastData Africa! I need support.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          </Button>
          <Button
            variant="secondary"
            className="h-12 flex-col gap-0.5 px-1 text-[11px] font-bold"
            onClick={() => setOpen(true)}
          >
            <Headphones className="h-4 w-4" />
            Live Chat
          </Button>
          <Button asChild variant="secondary" className="h-12 flex-col gap-0.5 px-1 text-[11px] font-bold">
            <a href={`mailto:${SUPPORT_EMAIL}`}>
              <Mail className="h-4 w-4" />
              Email
            </a>
          </Button>
        </div>
        <div className="mx-auto mt-2 flex max-w-md flex-wrap justify-center gap-x-3 gap-y-1">
          {SOCIAL_LINKS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-semibold text-muted-foreground hover:text-foreground"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Live Chat &amp; Help Center</DialogTitle>
            <DialogDescription>
              24/7 Live Support — an agent replies on WhatsApp within minutes.
            </DialogDescription>
          </DialogHeader>
          <ContactForm onSent={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
