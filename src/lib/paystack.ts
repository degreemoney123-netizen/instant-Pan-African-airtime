import { formatUsd, toUsd, type Country } from "@/lib/fastdata";

/** Publishable key — safe to ship to the browser. */
export const PAYSTACK_PUBLIC_KEY = "pk_live_8eebda08d1278148b2cdc5b3aa0ac27a5c0a4dcb";

/** Currencies Paystack charges directly. */
const SUPPORTED = new Set(["GHS", "NGN", "KES", "ZAR", "XOF"]);

/** Markets where Paystack Mobile Money is offered alongside cards. */
const MOMO_MARKETS = new Set(["GH", "KE", "RW", "CI"]);

export type PaystackCharge = {
  /** ISO currency passed to Paystack */
  currency: string;
  /** amount in the smallest currency unit (pesewas / kobo / cents) */
  subunit: number;
  /** Paystack channels for this market */
  channels: string[];
  /** true when the local currency was converted to USD */
  converted: boolean;
  /** human-readable charge amount, e.g. "GH₵ 60" or "$ 4.20" */
  display: string;
  localDisplay: string;
};

export function paystackCharge(country: Country, amount: number): PaystackCharge {
  const localDisplay = `${country.symbol} ${amount.toLocaleString("en-US", {
    minimumFractionDigits: country.round < 1 ? 2 : 0,
    maximumFractionDigits: country.round < 1 ? 2 : 0,
  })}`;

  if (SUPPORTED.has(country.currency)) {
    return {
      currency: country.currency,
      subunit: Math.round(amount * 100),
      channels: MOMO_MARKETS.has(country.code) ? ["mobile_money", "card"] : ["card"],
      converted: false,
      display: localDisplay,
      localDisplay,
    };
  }

  // Fallback: convert to USD (international cards only).
  const usd = Math.max(1, Math.ceil(toUsd(country, amount) * 100) / 100);
  return {
    currency: "USD",
    subunit: Math.round(usd * 100),
    channels: ["card"],
    converted: true,
    display: formatUsd(usd),
    localDisplay,
  };
}

type PaystackPop = {
  setup(options: {
    key: string;
    email: string;
    amount: number;
    currency: string;
    ref: string;
    channels: string[];
    metadata?: Record<string, unknown>;
    callback: (response: { reference: string }) => void;
    onClose: () => void;
  }): { openIframe: () => void };
};

declare global {
  interface Window {
    PaystackPop?: PaystackPop;
  }
}

let loader: Promise<PaystackPop> | null = null;

export function loadPaystack(): Promise<PaystackPop> {
  if (window.PaystackPop) return Promise.resolve(window.PaystackPop);
  if (loader) return loader;
  loader = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://js.paystack.co/v1/inline.js";
    s.async = true;
    s.onload = () =>
      window.PaystackPop ? resolve(window.PaystackPop) : reject(new Error("Paystack unavailable"));
    s.onerror = () => reject(new Error("Could not load Paystack checkout"));
    document.head.appendChild(s);
  });
  return loader;
}

export async function openPaystackCheckout(opts: {
  charge: PaystackCharge;
  reference: string;
  email: string;
  metadata: Record<string, unknown>;
  onSuccess: (reference: string) => void;
  onClose: () => void;
}): Promise<void> {
  const pop = await loadPaystack();
  pop
    .setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: opts.email,
      amount: opts.charge.subunit,
      currency: opts.charge.currency,
      ref: opts.reference,
      channels: opts.charge.channels,
      metadata: opts.metadata,
      callback: (res) => opts.onSuccess(res.reference),
      onClose: opts.onClose,
    })
    .openIframe();
}
