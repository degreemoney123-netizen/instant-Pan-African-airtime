import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import ReactMarkdown from "react-markdown";
import { Headset, Send, Square, X, Zap } from "lucide-react";
import { useLang } from "@/lib/i18n";

const SUGGESTIONS = [
  "Which bundle is best value for me?",
  "How do I pay with Mobile Money?",
  "How do I become a vendor?",
  "Track my order",
];

export function AssistantChat() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  const { messages, sendMessage, status, stop, error, clearError } = useChat({
    transport: new DefaultChatTransport({ api: "/api/assistant" }),
  });

  const busy = status === "submitted" || status === "streaming";

  const submit = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    sendMessage({ text: trimmed });
    setInput("");
  };

  return (
    <>
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-[4.75rem] right-4 z-50 flex items-center gap-2 rounded-full bg-navy px-4 py-3 text-primary-foreground shadow-pop"
          aria-label={t("asst_open")}
        >
          <Headset className="size-5 text-gold" />
          <span className="text-xs font-bold">{t("asst_open")}</span>
        </button>
      ) : null}

      {open ? (
        <div className="fixed inset-x-3 bottom-[4.75rem] z-50 flex max-h-[70vh] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-pop">
          <div className="flex items-center justify-between gap-2 bg-hero px-4 py-3 text-primary-foreground">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-full bg-gold/15">
                <Zap className="size-4.5 text-gold" />
              </span>
              <div>
                <p className="font-display text-sm font-bold">{t("asst_title")}</p>
                <p className="text-[10px] text-primary-foreground/60">{t("asst_sub")}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-1.5 text-primary-foreground/70 hover:bg-primary-foreground/10"
              aria-label="Close chat"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.length === 0 ? (
              <div>
                <p className="rounded-2xl bg-surface px-3 py-2.5 text-sm text-muted-foreground">
                  👋 Akwaaba! I'm the FastData Assistant. Ask me about bundles, prices, payments,
                  vendor plans or your orders — I reply instantly, 24/7.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => submit(s)}
                      className="rounded-full border border-border bg-surface px-3 py-1.5 text-[11px] font-semibold text-muted-foreground"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {messages.map((m) =>
              m.role === "user" ? (
                <div key={m.id} className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-br-md bg-navy px-3 py-2 text-sm text-primary-foreground">
                    {m.parts
                      .filter((p) => p.type === "text")
                      .map((p, i) => (
                        <span key={i}>{("text" in p && p.text) || ""}</span>
                      ))}
                  </div>
                </div>
              ) : (
                <div key={m.id} className="max-w-[92%] text-sm leading-relaxed [&_a]:text-navy [&_a]:underline [&_li]:ml-4 [&_li]:list-disc [&_ol_li]:list-decimal [&_p]:mt-1 [&_strong]:font-bold">
                  {m.parts
                    .filter((p) => p.type === "text")
                    .map((p, i) => (
                      <ReactMarkdown key={i}>{("text" in p && p.text) || ""}</ReactMarkdown>
                    ))}
                </div>
              ),
            )}

            {busy ? (
              <div className="flex gap-1 px-1 py-1" aria-label="Assistant is typing">
                <span className="size-2 animate-bounce rounded-full bg-gold [animation-delay:0ms]" />
                <span className="size-2 animate-bounce rounded-full bg-gold [animation-delay:120ms]" />
                <span className="size-2 animate-bounce rounded-full bg-gold [animation-delay:240ms]" />
              </div>
            ) : null}

            {error ? (
              <p className="rounded-2xl bg-destructive/10 px-3 py-2 text-xs text-destructive">
                Something went wrong.{" "}
                <button type="button" onClick={clearError} className="font-bold underline">
                  Dismiss
                </button>
              </p>
            ) : null}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(input);
            }}
            className="flex items-end gap-2 border-t border-border p-3"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit(input);
                }
              }}
              rows={1}
              placeholder={t("asst_ph")}
              className="max-h-24 flex-1 resize-none rounded-2xl border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-gold"
            />
            {busy ? (
              <button
                type="button"
                onClick={() => stop()}
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary"
                aria-label="Stop"
              >
                <Square className="size-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-navy text-primary-foreground disabled:opacity-40"
                aria-label="Send"
              >
                <Send className="size-4" />
              </button>
            )}
          </form>
        </div>
      ) : null}
    </>
  );
}
