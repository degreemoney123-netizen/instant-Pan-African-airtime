import { Check, Loader2 } from "lucide-react";

export type TimelineState = "complete" | "active" | "pending";

export interface TimelineStep {
  title: string;
  description: string;
  state: TimelineState;
}

export interface OrderProgressTimelineProps {
  /** 0 = awaiting payment, 1 = payment received, 2 = dispatching, 3 = delivered */
  stage: 0 | 1 | 2 | 3;
}

const BASE: { title: string; description: string }[] = [
  { title: "Payment Received", description: "Funds confirmed by our payment partner." },
  { title: "Dispatching to Telco Network", description: "Sending your bundle to the operator." },
  { title: "Bundle Delivered", description: "Data credited to the recipient number." },
];

export function OrderProgressTimeline({ stage }: OrderProgressTimelineProps) {
  const steps: TimelineStep[] = BASE.map((s, i) => ({
    ...s,
    state: stage > i + 1 ? "complete" : stage === i + 1 ? "active" : "pending",
  }));

  return (
    <ol className="space-y-0 rounded-2xl border border-border bg-card p-4">
      {steps.map((s, i) => (
        <li key={s.title} className="flex gap-3">
          <div className="flex flex-col items-center">
            <span
              className={`flex size-7 shrink-0 items-center justify-center rounded-full border-2 text-[11px] font-bold ${
                s.state === "complete"
                  ? "border-whatsapp bg-whatsapp text-whatsapp-foreground"
                  : s.state === "active"
                    ? "animate-pulse border-primary bg-primary text-primary-foreground"
                    : "border-border bg-secondary text-muted-foreground"
              }`}
            >
              {s.state === "complete" ? (
                <Check className="size-4" />
              ) : s.state === "active" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                i + 1
              )}
            </span>
            {i < steps.length - 1 ? (
              <span
                className={`my-1 w-0.5 flex-1 rounded-full ${
                  s.state === "complete" ? "bg-whatsapp" : "bg-border"
                }`}
              />
            ) : null}
          </div>
          <div className={`pb-4 ${i === steps.length - 1 ? "pb-0" : ""}`}>
            <p
              className={`text-sm font-bold ${s.state === "pending" ? "text-muted-foreground" : ""}`}
            >
              {s.title}
            </p>
            <p className="text-xs text-muted-foreground">{s.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
