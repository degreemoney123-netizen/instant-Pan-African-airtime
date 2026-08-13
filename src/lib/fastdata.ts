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
  region: "West Africa" | "East Africa" | "Southern Africa" | "North Africa";
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
      n("at", "AT Ghana", "AT", "at"),
    ],
    momo: [
      { label: "MTN MoMo Merchant", value: "FastData · 059 366 0497" },
      { label: "Telecel Cash", value: "FastData · 050 366 0497" },
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
];

export const REGIONS = ["West Africa", "East Africa", "Southern Africa", "North Africa"] as const;

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

export const formatMoney = (country: Country, amount: number) =>
  `${country.symbol} ${amount.toLocaleString("en-US")}`;

export const waLink = (message: string) =>
  `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message.slice(0, 900))}`;

export const isValidPhone = (v: string) => /^[0-9+]{8,15}$/.test(v.replace(/[\s-]/g, ""));
