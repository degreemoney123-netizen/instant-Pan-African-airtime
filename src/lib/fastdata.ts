export const ADMIN_WHATSAPP = "233503660497";

export type Network = { id: string; name: string; short: string; accent: AccentId };

export type AccentId = "mtn" | "telecel" | "at" | "airtel" | "vodacom" | "orange" | "safaricom";

export const ACCENT_BG: Record<AccentId, string> = {
  mtn: "bg-mtn text-mtn-foreground",
  telecel: "bg-telecel text-telecel-foreground",
  at: "bg-at text-at-foreground",
  airtel: "bg-telecel text-telecel-foreground",
  vodacom: "bg-telecel text-telecel-foreground",
  orange: "bg-orange text-orange-foreground",
  safaricom: "bg-safaricom text-safaricom-foreground",
};

export const ACCENT_BUTTON: Record<AccentId, "mtn" | "telecel" | "at" | "orange" | "safaricom"> = {
  mtn: "mtn",
  telecel: "telecel",
  at: "at",
  airtel: "telecel",
  vodacom: "telecel",
  orange: "orange",
  safaricom: "safaricom",
};

export type Country = {
  code: string;
  name: string;
  flag: string;
  region: "West Africa" | "East Africa" | "Southern Africa" | "North Africa" | "Global";
  /** international dialling code, e.g. +233 */
  dial: string;
  /** approximate value of 1 unit of local currency in USD (for the converter) */
  usd: number;
  currency: string;
  symbol: string;
  /** price of 1GB in local currency; other sizes scale from this */
  base: number;
  round: number;
  networks: Network[];
  momo: { label: string; value: string }[];
  vendor: { starter: number; vip: number; starterIncome: string; vipIncome: string; daily: string };
};

const n = (id: string, name: string, short: string, accent: AccentId): Network => ({
  id,
  name,
  short,
  accent,
});

export const COUNTRIES: Country[] = [
  {
    code: "GH",
    dial: "+233",
    usd: 0.083,
    name: "Ghana",
    flag: "🇬🇭",
    region: "West Africa",
    currency: "GHS",
    symbol: "GH₵",
    base: 6,
    round: 1,
    networks: [
      n("mtn", "MTN Ghana", "MTN", "mtn"),
      n("telecel", "Telecel Ghana", "Telecel", "telecel"),
      n("at", "AirtelTigo (AT)", "AirtelTigo", "at"),
    ],
    momo: [
      { label: "MTN MoMo Merchant", value: "FastData · +233 503660497" },
      { label: "Telecel Cash", value: "FastData · +233 503660497" },
    ],
    vendor: {
      starter: 50,
      vip: 100,
      starterIncome: "GH₵ 1,000 – GH₵ 1,800",
      vipIncome: "GH₵ 3,000+",
      daily: "Sell 15–20 bundles daily = GH₵ 100+ daily profit!",
    },
  },
  {
    code: "NG",
    dial: "+234",
    usd: 0.00065,
    name: "Nigeria",
    flag: "🇳🇬",
    region: "West Africa",
    currency: "NGN",
    symbol: "₦",
    base: 800,
    round: 50,
    networks: [
      n("mtn", "MTN Nigeria", "MTN", "mtn"),
      n("airtel", "Airtel Nigeria", "Airtel", "airtel"),
      n("glo", "Glo Nigeria", "Glo", "safaricom"),
      n("9mobile", "9mobile", "9mobile", "at"),
    ],
    momo: [
      { label: "Paystack (card / transfer)", value: "FastData Africa" },
      { label: "Bank transfer", value: "OPay · 8103660497" },
    ],
    vendor: {
      starter: 10000,
      vip: 20000,
      starterIncome: "₦120,000 – ₦200,000",
      vipIncome: "₦300,000+",
      daily: "Sell 15–20 bundles daily = ₦12,000+ daily profit!",
    },
  },
  {
    code: "CI",
    dial: "+225",
    usd: 0.0016,
    name: "Côte d'Ivoire",
    flag: "🇨🇮",
    region: "West Africa",
    currency: "XOF",
    symbol: "CFA",
    base: 900,
    round: 50,
    networks: [
      n("orange", "Orange CI", "Orange", "orange"),
      n("mtn", "MTN CI", "MTN", "mtn"),
      n("moov", "Moov Africa", "Moov", "at"),
    ],
    momo: [
      { label: "Orange Money", value: "FastData · 07 03 66 04 97" },
      { label: "MTN MoMo", value: "FastData · 05 03 66 04 97" },
    ],
    vendor: {
      starter: 15000,
      vip: 30000,
      starterIncome: "CFA 180,000 – CFA 300,000",
      vipIncome: "CFA 450,000+",
      daily: "Sell 15–20 bundles daily = CFA 18,000+ daily profit!",
    },
  },
  {
    code: "SN",
    dial: "+221",
    usd: 0.0016,
    name: "Senegal",
    flag: "🇸🇳",
    region: "West Africa",
    currency: "XOF",
    symbol: "CFA",
    base: 900,
    round: 50,
    networks: [
      n("orange", "Orange Sonatel", "Orange", "orange"),
      n("free", "Free Senegal", "Free", "safaricom"),
      n("expresso", "Expresso", "Expresso", "at"),
    ],
    momo: [
      { label: "Orange Money", value: "FastData · 77 366 0497" },
      { label: "Wave", value: "FastData · 76 366 0497" },
    ],
    vendor: {
      starter: 15000,
      vip: 30000,
      starterIncome: "CFA 180,000 – CFA 300,000",
      vipIncome: "CFA 450,000+",
      daily: "Sell 15–20 bundles daily = CFA 18,000+ daily profit!",
    },
  },
  {
    code: "KE",
    dial: "+254",
    usd: 0.0077,
    name: "Kenya",
    flag: "🇰🇪",
    region: "East Africa",
    currency: "KES",
    symbol: "KSh",
    base: 120,
    round: 10,
    networks: [
      n("safaricom", "Safaricom", "Safaricom", "safaricom"),
      n("airtel", "Airtel Kenya", "Airtel", "airtel"),
      n("telkom", "Telkom Kenya", "Telkom", "at"),
    ],
    momo: [
      { label: "M-PESA Paybill", value: "247247 · Acc FASTDATA" },
      { label: "Paystack (card)", value: "FastData Africa" },
    ],
    vendor: {
      starter: 1000,
      vip: 2000,
      starterIncome: "KSh 15,000 – KSh 25,000",
      vipIncome: "KSh 40,000+",
      daily: "Sell 15–20 bundles daily = KSh 1,600+ daily profit!",
    },
  },
  {
    code: "UG",
    dial: "+256",
    usd: 0.00027,
    name: "Uganda",
    flag: "🇺🇬",
    region: "East Africa",
    currency: "UGX",
    symbol: "USh",
    base: 3500,
    round: 500,
    networks: [
      n("mtn", "MTN Uganda", "MTN", "mtn"),
      n("airtel", "Airtel Uganda", "Airtel", "airtel"),
    ],
    momo: [
      { label: "MTN MoMo Pay", value: "FastData · 077 366 0497" },
      { label: "Airtel Money", value: "FastData · 075 366 0497" },
    ],
    vendor: {
      starter: 35000,
      vip: 70000,
      starterIncome: "USh 500,000 – USh 900,000",
      vipIncome: "USh 1,400,000+",
      daily: "Sell 15–20 bundles daily = USh 55,000+ daily profit!",
    },
  },
  {
    code: "TZ",
    dial: "+255",
    usd: 0.00038,
    name: "Tanzania",
    flag: "🇹🇿",
    region: "East Africa",
    currency: "TZS",
    symbol: "TSh",
    base: 2500,
    round: 500,
    networks: [
      n("vodacom", "Vodacom Tanzania", "Vodacom", "vodacom"),
      n("airtel", "Airtel Tanzania", "Airtel", "airtel"),
      n("tigo", "Yas (Tigo)", "Yas", "safaricom"),
    ],
    momo: [
      { label: "M-PESA", value: "FastData · 0754 366 049" },
      { label: "Airtel Money", value: "FastData · 0784 366 049" },
    ],
    vendor: {
      starter: 25000,
      vip: 50000,
      starterIncome: "TSh 400,000 – TSh 700,000",
      vipIncome: "TSh 1,100,000+",
      daily: "Sell 15–20 bundles daily = TSh 45,000+ daily profit!",
    },
  },
  {
    code: "RW",
    dial: "+250",
    usd: 0.00072,
    name: "Rwanda",
    flag: "🇷🇼",
    region: "East Africa",
    currency: "RWF",
    symbol: "FRw",
    base: 1200,
    round: 100,
    networks: [
      n("mtn", "MTN Rwanda", "MTN", "mtn"),
      n("airtel", "Airtel Rwanda", "Airtel", "airtel"),
    ],
    momo: [
      { label: "MTN MoMo Pay", value: "FastData · 078 366 0497" },
      { label: "Airtel Money", value: "FastData · 073 366 0497" },
    ],
    vendor: {
      starter: 12000,
      vip: 25000,
      starterIncome: "FRw 200,000 – FRw 350,000",
      vipIncome: "FRw 550,000+",
      daily: "Sell 15–20 bundles daily = FRw 22,000+ daily profit!",
    },
  },
  {
    code: "ZA",
    dial: "+27",
    usd: 0.055,
    name: "South Africa",
    flag: "🇿🇦",
    region: "Southern Africa",
    currency: "ZAR",
    symbol: "R",
    base: 20,
    round: 1,
    networks: [
      n("vodacom", "Vodacom", "Vodacom", "vodacom"),
      n("mtn", "MTN South Africa", "MTN", "mtn"),
      n("telkom", "Telkom SA", "Telkom", "at"),
      n("cellc", "Cell C", "Cell C", "safaricom"),
    ],
    momo: [
      { label: "Paystack (card / EFT)", value: "FastData Africa" },
      { label: "Capitec instant EFT", value: "FastData · 1366 0497" },
    ],
    vendor: {
      starter: 150,
      vip: 300,
      starterIncome: "R 4,000 – R 7,000",
      vipIncome: "R 11,000+",
      daily: "Sell 15–20 bundles daily = R 400+ daily profit!",
    },
  },
  {
    code: "ZM",
    dial: "+260",
    usd: 0.037,
    name: "Zambia",
    flag: "🇿🇲",
    region: "Southern Africa",
    currency: "ZMW",
    symbol: "K",
    base: 22,
    round: 1,
    networks: [
      n("mtn", "MTN Zambia", "MTN", "mtn"),
      n("airtel", "Airtel Zambia", "Airtel", "airtel"),
      n("zamtel", "Zamtel", "Zamtel", "safaricom"),
    ],
    momo: [
      { label: "MTN MoMo", value: "FastData · 096 366 0497" },
      { label: "Airtel Money", value: "FastData · 097 366 0497" },
    ],
    vendor: {
      starter: 200,
      vip: 400,
      starterIncome: "K 4,500 – K 8,000",
      vipIncome: "K 12,000+",
      daily: "Sell 15–20 bundles daily = K 450+ daily profit!",
    },
  },
  {
    code: "EG",
    dial: "+20",
    usd: 0.021,
    name: "Egypt",
    flag: "🇪🇬",
    region: "North Africa",
    currency: "EGP",
    symbol: "E£",
    base: 45,
    round: 5,
    networks: [
      n("vodafone", "Vodafone Egypt", "Vodafone", "vodacom"),
      n("orange", "Orange Egypt", "Orange", "orange"),
      n("etisalat", "e& Egypt", "e&", "safaricom"),
      n("we", "WE", "WE", "at"),
    ],
    momo: [
      { label: "Vodafone Cash", value: "FastData · 010 366 0497" },
      { label: "Paystack (card)", value: "FastData Africa" },
    ],
    vendor: {
      starter: 800,
      vip: 1600,
      starterIncome: "E£ 12,000 – E£ 20,000",
      vipIncome: "E£ 32,000+",
      daily: "Sell 15–20 bundles daily = E£ 1,200+ daily profit!",
    },
  },
  {
    code: "MA",
    dial: "+212",
    usd: 0.1,
    name: "Morocco",
    flag: "🇲🇦",
    region: "North Africa",
    currency: "MAD",
    symbol: "DH",
    base: 12,
    round: 1,
    networks: [
      n("iam", "Maroc Telecom", "IAM", "orange"),
      n("orange", "Orange Maroc", "Orange", "orange"),
      n("inwi", "inwi", "inwi", "telecel"),
    ],
    momo: [
      { label: "Cash Plus", value: "FastData · 06 03 66 04 97" },
      { label: "Paystack (card)", value: "FastData Africa" },
    ],
    vendor: {
      starter: 250,
      vip: 500,
      starterIncome: "DH 5,000 – DH 9,000",
      vipIncome: "DH 14,000+",
      daily: "Sell 15–20 bundles daily = DH 500+ daily profit!",
    },
  },
  {
    code: "CM",
    dial: "+237",
    usd: 0.0016,
    name: "Cameroon",
    flag: "🇨🇲",
    region: "West Africa",
    currency: "XAF",
    symbol: "FCFA",
    base: 900,
    round: 50,
    networks: [
      n("mtn", "MTN Cameroon", "MTN", "mtn"),
      n("orange", "Orange Cameroun", "Orange", "orange"),
      n("camtel", "Camtel Blue", "Camtel", "at"),
    ],
    momo: [
      { label: "MTN MoMo", value: "FastData · 67 366 0497" },
      { label: "Orange Money", value: "FastData · 69 366 0497" },
    ],
    vendor: {
      starter: 15000,
      vip: 30000,
      starterIncome: "FCFA 180,000 – FCFA 300,000",
      vipIncome: "FCFA 450,000+",
      daily: "Sell 15–20 bundles daily = FCFA 18,000+ daily profit!",
    },
  },
  {
    code: "GLOBAL",
    dial: "+1",
    usd: 1,
    name: "Global / Other",
    flag: "🌍",
    region: "Global",
    currency: "USD",
    symbol: "$",
    base: 0.5,
    round: 0.5,
    networks: [
      n("mtn", "MTN Group", "MTN", "mtn"),
      n("airtel", "Airtel Africa", "Airtel", "airtel"),
      n("orange", "Orange Group", "Orange", "orange"),
      n("other", "Other carrier", "Other", "at"),
    ],
    momo: [
      { label: "Paystack (card / transfer)", value: "FastData Africa" },
      { label: "WhatsApp support", value: "+233 503660497" },
    ],
    vendor: {
      starter: 5,
      vip: 10,
      starterIncome: "$ 120 – $ 220",
      vipIncome: "$ 350+",
      daily: "Sell 15–20 bundles daily = $ 12+ daily profit!",
    },
  },
];

export const REGIONS = [
  "West Africa",
  "East Africa",
  "Southern Africa",
  "North Africa",
  "Global",
] as const;

export const SIZES = ["1GB", "3GB", "5GB", "10GB", "20GB", "50GB", "100GB"] as const;

// multipliers relative to the 1GB base price (bulk gets cheaper per GB)
const MULT = [1, 2.6, 4.2, 7.8, 14.5, 34, 68];
const TAGS: Record<string, string | undefined> = {
  "3GB": "Popular",
  "10GB": "Best value",
  "50GB": "Bulk",
};

export type Bundle = { size: string; price: number; tag?: string };

export const bundlesFor = (country: Country, networkIndex = 0): Bundle[] => {
  const netAdjust = 1 - networkIndex * 0.04;
  return SIZES.map((size, i) => {
    const raw = country.base * (MULT[i] as number) * netAdjust;
    const price = Math.max(country.round, Math.round(raw / country.round) * country.round);
    const b: Bundle = { size, price };
    const tag = TAGS[size];
    if (tag) b.tag = tag;
    return b;
  });
};

const decimalsFor = (country: Country) => (country.round < 1 ? 2 : 0);

export const formatMoney = (country: Country, amount: number) =>
  `${country.symbol} ${amount.toLocaleString("en-US", {
    minimumFractionDigits: decimalsFor(country),
    maximumFractionDigits: decimalsFor(country),
  })}`;

/** approximate USD value of an amount in the country currency */
export const toUsd = (country: Country, amount: number) => amount * country.usd;

export const formatUsd = (amount: number) =>
  `$ ${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const waLink = (message: string) =>
  `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message.slice(0, 900))}`;

export const isValidPhone = (v: string) => /^[0-9+]{8,15}$/.test(v.replace(/[\s-]/g, ""));

export type OrderStatus = "Processing" | "Delivered" | "Pending Confirmation";

const hash = (v: string) => {
  let h = 0;
  for (let i = 0; i < v.length; i++) h = (h * 31 + v.charCodeAt(i)) >>> 0;
  return h;
};

export const makeOrderId = (prefix: string, seed: string) =>
  `${prefix}-${(hash(seed + Date.now().toString()) % 900000 + 100000).toString()}`;

export const trackOrder = (phone: string): { status: OrderStatus; note: string; ref: string } => {
  const clean = phone.replace(/[\s-]/g, "");
  const h = hash(clean);
  const statuses: OrderStatus[] = ["Delivered", "Processing", "Pending Confirmation"];
  const status = statuses[h % 3] as OrderStatus;
  const note =
    status === "Delivered"
      ? "Bundle credited successfully. Dial your data balance code to confirm."
      : status === "Processing"
        ? "Payment received. Your bundle is being credited (1–15 minutes)."
        : "We have not matched a payment yet. Send your receipt on WhatsApp.";
  return { status, note, ref: `FD-${(h % 900000) + 100000}` };
};

export const SUPPORT_EMAIL = "support@fastdataafrica.com";
export const SUPPORT_PHONE = "+233 503660497";
export const SUPPORT_PHONE_ALT = "+233 30 274 1188";

export const SOCIAL_LINKS = [
  { label: "X (Twitter)", href: "https://x.com/fastdataafrica" },
  { label: "Facebook", href: "https://facebook.com/fastdataafrica" },
  { label: "Instagram", href: "https://instagram.com/fastdataafrica" },
  { label: "LinkedIn", href: "https://linkedin.com/company/fastdataafrica" },
  { label: "Telegram Community", href: "https://t.me/fastdataafrica" },
];

export const TRUST_TRANSACTIONS = 50000;

export const TICKER_EVENTS = [
  "Kofi from Kumasi just bought a 5GB MTN bundle",
  "Ama from Kumasi bought a 10GB MTN bundle",
  "Kweku from Takoradi registered as a VIP Vendor",
  "Chidi from Lagos bought a 20GB Airtel bundle",
  "Amina from Nairobi bought KES 500 airtime",
  "Njeri from Nairobi bought a 5GB Safaricom bundle",
  "Yaw from Accra bought a 50GB Telecel bundle",
  "Fatou from Dakar registered as a Starter Agent",
  "Thabo from Johannesburg bought a 10GB Vodacom bundle",
  "Amina from Cairo bought a 3GB Orange bundle",
  "Kofi from Tamale bought a 100GB MTN bundle",
  "Grace from Kampala registered as a VIP Vendor",
  "Daniel in East Legon just bought a 5GB MTN bundle",
  "Abena paid ECG Power GH₵ 50",
  "Selorm in Ho renewed a DSTV subscription",
  "Musa from Kano bought a 10GB MTN bundle",
  "Adjoa in Tema paid a Ghana Water bill",
  "Aïcha from Abidjan bought a 3GB Orange bundle",
  "Sipho from Cape Town bought a 20GB MTN bundle",
  "Brian from Kigali bought a 2GB Airtel bundle",
  "Zainab from Abuja topped up ₦ 2,000 airtime",
  "Joseph from Dar es Salaam bought a 10GB Vodacom bundle",
];


/** Ghana mobile prefixes mapped to the local network id. */
export const GH_PREFIX_NETWORK: Record<string, "mtn" | "telecel" | "at"> = {
  "024": "mtn",
  "025": "mtn",
  "053": "mtn",
  "054": "mtn",
  "055": "mtn",
  "059": "mtn",
  "020": "telecel",
  "050": "telecel",
  "026": "at",
  "027": "at",
  "056": "at",
  "057": "at",
};

/** Normalises +233 / 233 / 0XX input to the local 0XXXXXXXXX form. */
export const normalizePhone = (value: string, country: Country) => {
  let v = value.replace(/[^\d+]/g, "");
  const dial = country.dial.replace("+", "");
  if (v.startsWith("+")) v = v.slice(1);
  if (v.startsWith(dial)) v = v.slice(dial.length);
  if (!v.startsWith("0")) v = `0${v}`;
  return v;
};

/** Auto-detects the network from a Ghanaian number; null when unknown. */
export const detectNetwork = (value: string, country: Country): string | null => {
  if (country.code !== "GH") return null;
  const local = normalizePhone(value, country);
  if (local.length < 4) return null;
  return GH_PREFIX_NETWORK[local.slice(0, 3)] ?? null;
};

/** Ghana numbers must be 10 digits with a known prefix; others use a loose check. */
export const isValidLocalPhone = (value: string, country: Country) => {
  const local = normalizePhone(value, country);
  if (country.code === "GH") return /^0\d{9}$/.test(local) && !!GH_PREFIX_NETWORK[local.slice(0, 3)];
  return /^0\d{7,13}$/.test(local);
};

export type PaymentMethodId = "paystack" | "momo" | "wallet";

export const PAYMENT_METHODS: { id: PaymentMethodId; name: string; blurb: string; icon: string }[] =
  [
    { id: "paystack", name: "Paystack (Card / MoMo)", blurb: "Instant, automatically verified", icon: "💳" },
    { id: "momo", name: "Direct MoMo transfer", blurb: "Send to our merchant number", icon: "📱" },
    { id: "wallet", name: "Agent wallet balance", blurb: "For registered agents only", icon: "👛" },
  ];

/** Wholesale (agent) price — bulk discount off the retail price. */
export const AGENT_DISCOUNT = 0.18;
export const agentPrice = (country: Country, price: number) =>
  Math.max(country.round, Math.round((price * (1 - AGENT_DISCOUNT)) / country.round) * country.round);

export const TRACK_STEPS = [
  "Order Placed",
  "Payment Verified",
  "Processing with Telco",
  "Bundle Delivered",
] as const;

/** How far along the timeline a stored order status is (0-based index). */
export const stepIndexForStatus = (status: string) => {
  const s = status.toLowerCase();
  if (s.includes("deliver")) return 3;
  if (s.includes("processing") || s.includes("paid")) return 2;
  if (s.includes("verified")) return 1;
  return 0;
};
