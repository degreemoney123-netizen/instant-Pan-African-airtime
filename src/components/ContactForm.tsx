import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SUPPORT_EMAIL, waLink } from "@/lib/fastdata";

const ISSUE_TYPES = [
  "Bundle not delivered",
  "Payment / refund issue",
  "Agent & vendor enquiry",
  "Utility bill payment",
  "Other",
];

export function ContactForm({ onSent }: { onSent?: () => void }) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [issue, setIssue] = useState(ISSUE_TYPES[0]!);
  const [message, setMessage] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return toast.error("Please enter your name.");
    if (contact.trim().length < 5) return toast.error("Enter a valid email or phone number.");
    if (message.trim().length < 10) return toast.error("Please describe your issue (10+ characters).");

    const body = `Name: ${name}\nContact: ${contact}\nIssue: ${issue}\n\n${message}`;
    window.open(waLink(`Support request — FastData Africa\n\n${body}`), "_blank", "noopener");
    toast.success("Support request sent. Our team replies within minutes, 24/7.");
    setMessage("");
    onSent?.();
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <Label htmlFor="cf-name">Full name</Label>
        <Input
          id="cf-name"
          value={name}
          maxLength={80}
          onChange={(e) => setName(e.target.value)}
          placeholder="Kofi Mensah"
          className="mt-1 h-11"
        />
      </div>
      <div>
        <Label htmlFor="cf-contact">Email or phone</Label>
        <Input
          id="cf-contact"
          value={contact}
          maxLength={120}
          onChange={(e) => setContact(e.target.value)}
          placeholder="you@email.com / 024 000 0000"
          className="mt-1 h-11"
        />
      </div>
      <div>
        <Label>Issue type</Label>
        <Select value={issue} onValueChange={setIssue}>
          <SelectTrigger className="mt-1 h-11">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ISSUE_TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="cf-msg">Message</Label>
        <Textarea
          id="cf-msg"
          value={message}
          maxLength={1000}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us what happened, with your order reference if you have one."
          className="mt-1 min-h-24"
        />
      </div>
      <Button type="submit" variant="whatsapp" className="h-12 w-full text-base">
        Send message to support
      </Button>
      <p className="text-center text-[11px] text-muted-foreground">
        Prefer email? Write to{" "}
        <a className="font-semibold underline" href={`mailto:${SUPPORT_EMAIL}`}>
          {SUPPORT_EMAIL}
        </a>
      </p>
    </form>
  );
}
