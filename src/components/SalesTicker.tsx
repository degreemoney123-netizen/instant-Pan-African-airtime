import { useEffect, useState } from "react";
import { TICKER_EVENTS } from "@/lib/fastdata";

export function SalesTicker() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const cycle = () => {
      setIndex(Math.floor(Math.random() * TICKER_EVENTS.length));
      setVisible(true);
      timeout = setTimeout(() => setVisible(false), 5000);
    };
    const first = setTimeout(cycle, 2500);
    const interval = setInterval(cycle, 11000);
    return () => {
      clearTimeout(first);
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      aria-live="polite"
      className={`pointer-events-none fixed bottom-24 left-3 z-30 max-w-[80vw] transition-all duration-500 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
    >
      <div className="flex items-center gap-2 rounded-full border border-border bg-card/95 px-3 py-2 shadow-card backdrop-blur">
        <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-whatsapp" />
        <span className="truncate text-xs font-semibold">{TICKER_EVENTS[index]}</span>
      </div>
    </div>
  );
}
