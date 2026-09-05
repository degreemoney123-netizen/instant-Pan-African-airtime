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
  region: "West Africa" | "East Africa" | "Central Africa" | "Southern Africa" | "North Africa" | "Global";
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
    region: "Central Africa",
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
    code: "DZ",
    dial: "+213",
    usd: 0.0074,
    name: "Algeria",
    flag: "🇩🇿",
    region: "North Africa",
    currency: "DZD",
    symbol: "DA",
    base: 250,
    round: 10,
    networks: [
      n("djezzy", "Djezzy Algeria", "Djezzy", "mtn"),
      n("ooredoo", "Ooredoo Algeria", "Ooredoo", "telecel"),
      n("mobilis", "Mobilis Algeria", "Mobilis", "at"),
    ],
    momo: [
      { label: "Mobile Money / Paystack", value: "FastData Africa" },
      { label: "WhatsApp support", value: "+233 503660497" },
    ],
    vendor: {
      starter: 2000,
      vip: 4000,
      starterIncome: "DA 5,000 – DA 9,000",
      vipIncome: "DA 15,000+",
      daily: "Sell 15–20 bundles daily = DA 500+ daily profit!",
    },
  },
  {
    code: "AO",
    dial: "+244",
    usd: 0.0011,
    name: "Angola",
    flag: "🇦🇴",
    region: "Southern Africa",
    currency: "AOA",
    symbol: "Kz",
    base: 1500,
    round: 50,
    networks: [
      n("unitel", "Unitel Angola", "Unitel", "mtn"),
      n("africell", "Africell Angola", "Africell", "telecel"),
      n("movicel", "Movicel Angola", "Movicel", "at"),
    ],
    momo: [
      { label: "Mobile Money / Paystack", value: "FastData Africa" },
      { label: "WhatsApp support", value: "+233 503660497" },
    ],
    vendor: {
      starter: 12000,
      vip: 24000,
      starterIncome: "Kz 30,000 – Kz 54,000",
      vipIncome: "Kz 90,000+",
      daily: "Sell 15–20 bundles daily = Kz 3,000+ daily profit!",
    },
  },
  {
    code: "BJ",
    dial: "+229",
    usd: 0.0016,
    name: "Benin",
    flag: "🇧🇯",
    region: "West Africa",
    currency: "XOF",
    symbol: "CFA",
    base: 900,
    round: 50,
    networks: [
      n("mtn", "MTN Benin", "MTN", "mtn"),
      n("moov", "Moov Africa Benin", "Moov Africa", "at"),
      n("celtiis", "Celtiis Benin", "Celtiis", "telecel"),
    ],
    momo: [
      { label: "Mobile Money / Paystack", value: "FastData Africa" },
      { label: "WhatsApp support", value: "+233 503660497" },
    ],
    vendor: {
      starter: 7200,
      vip: 14400,
      starterIncome: "CFA 18,000 – CFA 32,400",
      vipIncome: "CFA 54,000+",
      daily: "Sell 15–20 bundles daily = CFA 1,800+ daily profit!",
    },
  },
  {
    code: "BW",
    dial: "+267",
    usd: 0.073,
    name: "Botswana",
    flag: "🇧🇼",
    region: "Southern Africa",
    currency: "BWP",
    symbol: "P",
    base: 30,
    round: 1,
    networks: [
      n("mascom", "Mascom Botswana", "Mascom", "mtn"),
      n("orange", "Orange Botswana", "Orange", "orange"),
      n("btc", "beMOBILE Botswana", "beMOBILE", "at"),
    ],
    momo: [
      { label: "Mobile Money / Paystack", value: "FastData Africa" },
      { label: "WhatsApp support", value: "+233 503660497" },
    ],
    vendor: {
      starter: 240,
      vip: 480,
      starterIncome: "P 600 – P 1,080",
      vipIncome: "P 1,800+",
      daily: "Sell 15–20 bundles daily = P 60+ daily profit!",
    },
  },
  {
    code: "BF",
    dial: "+226",
    usd: 0.0016,
    name: "Burkina Faso",
    flag: "🇧🇫",
    region: "West Africa",
    currency: "XOF",
    symbol: "CFA",
    base: 900,
    round: 50,
    networks: [
      n("orange", "Orange Burkina Faso", "Orange", "orange"),
      n("moov", "Moov Africa Burkina Faso", "Moov Africa", "at"),
      n("telecel", "Telecel Faso Burkina Faso", "Telecel Faso", "telecel"),
    ],
    momo: [
      { label: "Mobile Money / Paystack", value: "FastData Africa" },
      { label: "WhatsApp support", value: "+233 503660497" },
    ],
    vendor: {
      starter: 7200,
      vip: 14400,
      starterIncome: "CFA 18,000 – CFA 32,400",
      vipIncome: "CFA 54,000+",
      daily: "Sell 15–20 bundles daily = CFA 1,800+ daily profit!",
    },
  },
  {
    code: "BI",
    dial: "+257",
    usd: 0.00035,
    name: "Burundi",
    flag: "🇧🇮",
    region: "East Africa",
    currency: "BIF",
    symbol: "FBu",
    base: 3500,
    round: 100,
    networks: [
      n("lumitel", "Lumitel Burundi", "Lumitel", "mtn"),
      n("econet", "Econet Leo Burundi", "Econet Leo", "telecel"),
      n("smart", "Smart Burundi", "Smart", "at"),
    ],
    momo: [
      { label: "Mobile Money / Paystack", value: "FastData Africa" },
      { label: "WhatsApp support", value: "+233 503660497" },
    ],
    vendor: {
      starter: 28000,
      vip: 56000,
      starterIncome: "FBu 70,000 – FBu 126,000",
      vipIncome: "FBu 210,000+",
      daily: "Sell 15–20 bundles daily = FBu 7,000+ daily profit!",
    },
  },
  {
    code: "CV",
    dial: "+238",
    usd: 0.0098,
    name: "Cabo Verde",
    flag: "🇨🇻",
    region: "West Africa",
    currency: "CVE",
    symbol: "$",
    base: 180,
    round: 10,
    networks: [
      n("cvmovel", "CVMóvel Cabo Verde", "CVMóvel", "mtn"),
      n("unitel", "Unitel T+ Cabo Verde", "Unitel T+", "telecel"),
    ],
    momo: [
      { label: "Mobile Money / Paystack", value: "FastData Africa" },
      { label: "WhatsApp support", value: "+233 503660497" },
    ],
    vendor: {
      starter: 1440,
      vip: 2880,
      starterIncome: "$ 3,600 – $ 6,480",
      vipIncome: "$ 10,800+",
      daily: "Sell 15–20 bundles daily = $ 360+ daily profit!",
    },
  },
  {
    code: "CF",
    dial: "+236",
    usd: 0.0016,
    name: "Central African Republic",
    flag: "🇨🇫",
    region: "Central Africa",
    currency: "XAF",
    symbol: "FCFA",
    base: 1200,
    round: 50,
    networks: [
      n("orange", "Orange Central African Republic", "Orange", "orange"),
      n("telecel", "Telecel Central African Republic", "Telecel", "telecel"),
      n("moov", "Moov Africa Central African Republic", "Moov Africa", "at"),
    ],
    momo: [
      { label: "Mobile Money / Paystack", value: "FastData Africa" },
      { label: "WhatsApp support", value: "+233 503660497" },
    ],
    vendor: {
      starter: 9600,
      vip: 19200,
      starterIncome: "FCFA 24,000 – FCFA 43,200",
      vipIncome: "FCFA 72,000+",
      daily: "Sell 15–20 bundles daily = FCFA 2,400+ daily profit!",
    },
  },
  {
    code: "TD",
    dial: "+235",
    usd: 0.0016,
    name: "Chad",
    flag: "🇹🇩",
    region: "Central Africa",
    currency: "XAF",
    symbol: "FCFA",
    base: 1200,
    round: 50,
    networks: [
      n("airtel", "Airtel Chad", "Airtel", "airtel"),
      n("moov", "Moov Africa Chad", "Moov Africa", "at"),
    ],
    momo: [
      { label: "Mobile Money / Paystack", value: "FastData Africa" },
      { label: "WhatsApp support", value: "+233 503660497" },
    ],
    vendor: {
      starter: 9600,
      vip: 19200,
      starterIncome: "FCFA 24,000 – FCFA 43,200",
      vipIncome: "FCFA 72,000+",
      daily: "Sell 15–20 bundles daily = FCFA 2,400+ daily profit!",
    },
  },
  {
    code: "KM",
    dial: "+269",
    usd: 0.0022,
    name: "Comoros",
    flag: "🇰🇲",
    region: "East Africa",
    currency: "KMF",
    symbol: "CF",
    base: 900,
    round: 50,
    networks: [
      n("telma", "Telma Comoros", "Telma", "mtn"),
      n("comorestelecom", "Comores Telecom Comoros", "Comores Telecom", "telecel"),
    ],
    momo: [
      { label: "Mobile Money / Paystack", value: "FastData Africa" },
      { label: "WhatsApp support", value: "+233 503660497" },
    ],
    vendor: {
      starter: 7200,
      vip: 14400,
      starterIncome: "CF 18,000 – CF 32,400",
      vipIncome: "CF 54,000+",
      daily: "Sell 15–20 bundles daily = CF 1,800+ daily profit!",
    },
  },
  {
    code: "CD",
    dial: "+243",
    usd: 0.00035,
    name: "DR Congo",
    flag: "🇨🇩",
    region: "Central Africa",
    currency: "CDF",
    symbol: "FC",
    base: 4000,
    round: 100,
    networks: [
      n("vodacom", "Vodacom DR Congo", "Vodacom", "telecel"),
      n("airtel", "Airtel DR Congo", "Airtel", "airtel"),
      n("orange", "Orange DR Congo", "Orange", "orange"),
      n("africell", "Africell DR Congo", "Africell", "at"),
    ],
    momo: [
      { label: "Mobile Money / Paystack", value: "FastData Africa" },
      { label: "WhatsApp support", value: "+233 503660497" },
    ],
    vendor: {
      starter: 32000,
      vip: 64000,
      starterIncome: "FC 80,000 – FC 144,000",
      vipIncome: "FC 240,000+",
      daily: "Sell 15–20 bundles daily = FC 8,000+ daily profit!",
    },
  },
  {
    code: "CG",
    dial: "+242",
    usd: 0.0016,
    name: "Republic of Congo",
    flag: "🇨🇬",
    region: "Central Africa",
    currency: "XAF",
    symbol: "FCFA",
    base: 1200,
    round: 50,
    networks: [
      n("mtn", "MTN Republic of Congo", "MTN", "mtn"),
      n("airtel", "Airtel Republic of Congo", "Airtel", "airtel"),
    ],
    momo: [
      { label: "Mobile Money / Paystack", value: "FastData Africa" },
      { label: "WhatsApp support", value: "+233 503660497" },
    ],
    vendor: {
      starter: 9600,
      vip: 19200,
      starterIncome: "FCFA 24,000 – FCFA 43,200",
      vipIncome: "FCFA 72,000+",
      daily: "Sell 15–20 bundles daily = FCFA 2,400+ daily profit!",
    },
  },
  {
    code: "DJ",
    dial: "+253",
    usd: 0.0056,
    name: "Djibouti",
    flag: "🇩🇯",
    region: "East Africa",
    currency: "DJF",
    symbol: "Fdj",
    base: 350,
    round: 10,
    networks: [
      n("evatis", "Evatis Djibouti", "Evatis", "mtn"),
    ],
    momo: [
      { label: "Mobile Money / Paystack", value: "FastData Africa" },
      { label: "WhatsApp support", value: "+233 503660497" },
    ],
    vendor: {
      starter: 2800,
      vip: 5600,
      starterIncome: "Fdj 7,000 – Fdj 12,600",
      vipIncome: "Fdj 21,000+",
      daily: "Sell 15–20 bundles daily = Fdj 700+ daily profit!",
    },
  },
  {
    code: "GQ",
    dial: "+240",
    usd: 0.0016,
    name: "Equatorial Guinea",
    flag: "🇬🇶",
    region: "Central Africa",
    currency: "XAF",
    symbol: "FCFA",
    base: 1200,
    round: 50,
    networks: [
      n("muni", "Muni Equatorial Guinea", "Muni", "mtn"),
      n("orange", "Orange Equatorial Guinea", "Orange", "orange"),
    ],
    momo: [
      { label: "Mobile Money / Paystack", value: "FastData Africa" },
      { label: "WhatsApp support", value: "+233 503660497" },
    ],
    vendor: {
      starter: 9600,
      vip: 19200,
      starterIncome: "FCFA 24,000 – FCFA 43,200",
      vipIncome: "FCFA 72,000+",
      daily: "Sell 15–20 bundles daily = FCFA 2,400+ daily profit!",
    },
  },
  {
    code: "ER",
    dial: "+291",
    usd: 0.067,
    name: "Eritrea",
    flag: "🇪🇷",
    region: "East Africa",
    currency: "ERN",
    symbol: "Nfk",
    base: 30,
    round: 1,
    networks: [
      n("eritel", "EriTel Eritrea", "EriTel", "mtn"),
    ],
    momo: [
      { label: "Mobile Money / Paystack", value: "FastData Africa" },
      { label: "WhatsApp support", value: "+233 503660497" },
    ],
    vendor: {
      starter: 240,
      vip: 480,
      starterIncome: "Nfk 600 – Nfk 1,080",
      vipIncome: "Nfk 1,800+",
      daily: "Sell 15–20 bundles daily = Nfk 60+ daily profit!",
    },
  },
  {
    code: "SZ",
    dial: "+268",
    usd: 0.055,
    name: "Eswatini",
    flag: "🇸🇿",
    region: "Southern Africa",
    currency: "SZL",
    symbol: "E",
    base: 40,
    round: 1,
    networks: [
      n("mtn", "MTN Eswatini", "MTN", "mtn"),
      n("eswatinimobile", "Eswatini Mobile Eswatini", "Eswatini Mobile", "telecel"),
    ],
    momo: [
      { label: "Mobile Money / Paystack", value: "FastData Africa" },
      { label: "WhatsApp support", value: "+233 503660497" },
    ],
    vendor: {
      starter: 320,
      vip: 640,
      starterIncome: "E 800 – E 1,440",
      vipIncome: "E 2,400+",
      daily: "Sell 15–20 bundles daily = E 80+ daily profit!",
    },
  },
  {
    code: "ET",
    dial: "+251",
    usd: 0.0082,
    name: "Ethiopia",
    flag: "🇪🇹",
    region: "East Africa",
    currency: "ETB",
    symbol: "Br",
    base: 220,
    round: 10,
    networks: [
      n("ethiotel", "Ethio Telecom Ethiopia", "Ethio Telecom", "mtn"),
      n("safaricom", "Safaricom Ethiopia", "Safaricom", "safaricom"),
    ],
    momo: [
      { label: "Mobile Money / Paystack", value: "FastData Africa" },
      { label: "WhatsApp support", value: "+233 503660497" },
    ],
    vendor: {
      starter: 1760,
      vip: 3520,
      starterIncome: "Br 4,400 – Br 7,920",
      vipIncome: "Br 13,200+",
      daily: "Sell 15–20 bundles daily = Br 440+ daily profit!",
    },
  },
  {
    code: "GA",
    dial: "+241",
    usd: 0.0016,
    name: "Gabon",
    flag: "🇬🇦",
    region: "Central Africa",
    currency: "XAF",
    symbol: "FCFA",
    base: 1200,
    round: 50,
    networks: [
      n("airtel", "Airtel Gabon", "Airtel", "airtel"),
      n("moov", "Moov Africa Gabon", "Moov Africa", "at"),
    ],
    momo: [
      { label: "Mobile Money / Paystack", value: "FastData Africa" },
      { label: "WhatsApp support", value: "+233 503660497" },
    ],
    vendor: {
      starter: 9600,
      vip: 19200,
      starterIncome: "FCFA 24,000 – FCFA 43,200",
      vipIncome: "FCFA 72,000+",
      daily: "Sell 15–20 bundles daily = FCFA 2,400+ daily profit!",
    },
  },
  {
    code: "GM",
    dial: "+220",
    usd: 0.014,
    name: "Gambia",
    flag: "🇬🇲",
    region: "West Africa",
    currency: "GMD",
    symbol: "D",
    base: 130,
    round: 5,
    networks: [
      n("africell", "Africell Gambia", "Africell", "telecel"),
      n("qcell", "QCell Gambia", "QCell", "mtn"),
      n("gamcel", "Gamcel Gambia", "Gamcel", "at"),
    ],
    momo: [
      { label: "Mobile Money / Paystack", value: "FastData Africa" },
      { label: "WhatsApp support", value: "+233 503660497" },
    ],
    vendor: {
      starter: 1040,
      vip: 2080,
      starterIncome: "D 2,600 – D 4,680",
      vipIncome: "D 7,800+",
      daily: "Sell 15–20 bundles daily = D 260+ daily profit!",
    },
  },
  {
    code: "GN",
    dial: "+224",
    usd: 0.00012,
    name: "Guinea",
    flag: "🇬🇳",
    region: "West Africa",
    currency: "GNF",
    symbol: "FG",
    base: 15000,
    round: 500,
    networks: [
      n("orange", "Orange Guinea", "Orange", "orange"),
      n("mtn", "MTN Guinea", "MTN", "mtn"),
      n("cellcom", "Cellcom Guinea", "Cellcom", "at"),
    ],
    momo: [
      { label: "Mobile Money / Paystack", value: "FastData Africa" },
      { label: "WhatsApp support", value: "+233 503660497" },
    ],
    vendor: {
      starter: 120000,
      vip: 240000,
      starterIncome: "FG 300,000 – FG 540,000",
      vipIncome: "FG 900,000+",
      daily: "Sell 15–20 bundles daily = FG 30,000+ daily profit!",
    },
  },
  {
    code: "GW",
    dial: "+245",
    usd: 0.0016,
    name: "Guinea-Bissau",
    flag: "🇬🇼",
    region: "West Africa",
    currency: "XOF",
    symbol: "CFA",
    base: 900,
    round: 50,
    networks: [
      n("mtn", "MTN Guinea-Bissau", "MTN", "mtn"),
      n("orange", "Orange Guinea-Bissau", "Orange", "orange"),
    ],
    momo: [
      { label: "Mobile Money / Paystack", value: "FastData Africa" },
      { label: "WhatsApp support", value: "+233 503660497" },
    ],
    vendor: {
      starter: 7200,
      vip: 14400,
      starterIncome: "CFA 18,000 – CFA 32,400",
      vipIncome: "CFA 54,000+",
      daily: "Sell 15–20 bundles daily = CFA 1,800+ daily profit!",
    },
  },
  {
    code: "LS",
    dial: "+266",
    usd: 0.055,
    name: "Lesotho",
    flag: "🇱🇸",
    region: "Southern Africa",
    currency: "LSL",
    symbol: "M",
    base: 40,
    round: 1,
    networks: [
      n("vodacom", "Vodacom Lesotho", "Vodacom", "telecel"),
      n("econet", "Econet Lesotho", "Econet", "mtn"),
    ],
    momo: [
      { label: "Mobile Money / Paystack", value: "FastData Africa" },
      { label: "WhatsApp support", value: "+233 503660497" },
    ],
    vendor: {
      starter: 320,
      vip: 640,
      starterIncome: "M 800 – M 1,440",
      vipIncome: "M 2,400+",
      daily: "Sell 15–20 bundles daily = M 80+ daily profit!",
    },
  },
  {
    code: "LR",
    dial: "+231",
    usd: 0.0052,
    name: "Liberia",
    flag: "🇱🇷",
    region: "West Africa",
    currency: "LRD",
    symbol: "L$",
    base: 350,
    round: 10,
    networks: [
      n("lonestar", "Lonestar MTN Liberia", "Lonestar MTN", "mtn"),
      n("orange", "Orange Liberia", "Orange", "orange"),
    ],
    momo: [
      { label: "Mobile Money / Paystack", value: "FastData Africa" },
      { label: "WhatsApp support", value: "+233 503660497" },
    ],
    vendor: {
      starter: 2800,
      vip: 5600,
      starterIncome: "L$ 7,000 – L$ 12,600",
      vipIncome: "L$ 21,000+",
      daily: "Sell 15–20 bundles daily = L$ 700+ daily profit!",
    },
  },
  {
    code: "LY",
    dial: "+218",
    usd: 0.21,
    name: "Libya",
    flag: "🇱🇾",
    region: "North Africa",
    currency: "LYD",
    symbol: "LD",
    base: 10,
    round: 1,
    networks: [
      n("libyana", "Libyana Libya", "Libyana", "mtn"),
      n("almadar", "Almadar Libya", "Almadar", "telecel"),
    ],
    momo: [
      { label: "Mobile Money / Paystack", value: "FastData Africa" },
      { label: "WhatsApp support", value: "+233 503660497" },
    ],
    vendor: {
      starter: 80,
      vip: 160,
      starterIncome: "LD 200 – LD 360",
      vipIncome: "LD 600+",
      daily: "Sell 15–20 bundles daily = LD 20+ daily profit!",
    },
  },
  {
    code: "MG",
    dial: "+261",
    usd: 0.00022,
    name: "Madagascar",
    flag: "🇲🇬",
    region: "East Africa",
    currency: "MGA",
    symbol: "Ar",
    base: 9000,
    round: 500,
    networks: [
      n("telma", "Telma Madagascar", "Telma", "mtn"),
      n("orange", "Orange Madagascar", "Orange", "orange"),
      n("airtel", "Airtel Madagascar", "Airtel", "airtel"),
    ],
    momo: [
      { label: "Mobile Money / Paystack", value: "FastData Africa" },
      { label: "WhatsApp support", value: "+233 503660497" },
    ],
    vendor: {
      starter: 72000,
      vip: 144000,
      starterIncome: "Ar 180,000 – Ar 324,000",
      vipIncome: "Ar 540,000+",
      daily: "Sell 15–20 bundles daily = Ar 18,000+ daily profit!",
    },
  },
  {
    code: "MW",
    dial: "+265",
    usd: 0.00058,
    name: "Malawi",
    flag: "🇲🇼",
    region: "Southern Africa",
    currency: "MWK",
    symbol: "MK",
    base: 3500,
    round: 100,
    networks: [
      n("airtel", "Airtel Malawi", "Airtel", "airtel"),
      n("tnm", "TNM Malawi", "TNM", "mtn"),
    ],
    momo: [
      { label: "Mobile Money / Paystack", value: "FastData Africa" },
      { label: "WhatsApp support", value: "+233 503660497" },
    ],
    vendor: {
      starter: 28000,
      vip: 56000,
      starterIncome: "MK 70,000 – MK 126,000",
      vipIncome: "MK 210,000+",
      daily: "Sell 15–20 bundles daily = MK 7,000+ daily profit!",
    },
  },
  {
    code: "ML",
    dial: "+223",
    usd: 0.0016,
    name: "Mali",
    flag: "🇲🇱",
    region: "West Africa",
    currency: "XOF",
    symbol: "CFA",
    base: 900,
    round: 50,
    networks: [
      n("orange", "Orange Mali", "Orange", "orange"),
      n("moov", "Moov Africa Mali", "Moov Africa", "at"),
    ],
    momo: [
      { label: "Mobile Money / Paystack", value: "FastData Africa" },
      { label: "WhatsApp support", value: "+233 503660497" },
    ],
    vendor: {
      starter: 7200,
      vip: 14400,
      starterIncome: "CFA 18,000 – CFA 32,400",
      vipIncome: "CFA 54,000+",
      daily: "Sell 15–20 bundles daily = CFA 1,800+ daily profit!",
    },
  },
  {
    code: "MR",
    dial: "+222",
    usd: 0.025,
    name: "Mauritania",
    flag: "🇲🇷",
    region: "West Africa",
    currency: "MRU",
    symbol: "UM",
    base: 80,
    round: 5,
    networks: [
      n("mauritel", "Mauritel Mauritania", "Mauritel", "mtn"),
      n("chinguitel", "Chinguitel Mauritania", "Chinguitel", "telecel"),
      n("mattel", "Mattel Mauritania", "Mattel", "at"),
    ],
    momo: [
      { label: "Mobile Money / Paystack", value: "FastData Africa" },
      { label: "WhatsApp support", value: "+233 503660497" },
    ],
    vendor: {
      starter: 640,
      vip: 1280,
      starterIncome: "UM 1,600 – UM 2,880",
      vipIncome: "UM 4,800+",
      daily: "Sell 15–20 bundles daily = UM 160+ daily profit!",
    },
  },
  {
    code: "MU",
    dial: "+230",
    usd: 0.022,
    name: "Mauritius",
    flag: "🇲🇺",
    region: "East Africa",
    currency: "MUR",
    symbol: "Rs",
    base: 90,
    round: 5,
    networks: [
      n("myt", "my.t Mauritius", "my.t", "mtn"),
      n("emtel", "Emtel Mauritius", "Emtel", "telecel"),
      n("chili", "Chili Mauritius", "Chili", "at"),
    ],
    momo: [
      { label: "Mobile Money / Paystack", value: "FastData Africa" },
      { label: "WhatsApp support", value: "+233 503660497" },
    ],
    vendor: {
      starter: 720,
      vip: 1440,
      starterIncome: "Rs 1,800 – Rs 3,240",
      vipIncome: "Rs 5,400+",
      daily: "Sell 15–20 bundles daily = Rs 180+ daily profit!",
    },
  },
  {
    code: "MZ",
    dial: "+258",
    usd: 0.016,
    name: "Mozambique",
    flag: "🇲🇿",
    region: "Southern Africa",
    currency: "MZN",
    symbol: "MT",
    base: 130,
    round: 5,
    networks: [
      n("vodacom", "Vodacom Mozambique", "Vodacom", "telecel"),
      n("tmcel", "Tmcel Mozambique", "Tmcel", "mtn"),
      n("movitel", "Movitel Mozambique", "Movitel", "at"),
    ],
    momo: [
      { label: "Mobile Money / Paystack", value: "FastData Africa" },
      { label: "WhatsApp support", value: "+233 503660497" },
    ],
    vendor: {
      starter: 1040,
      vip: 2080,
      starterIncome: "MT 2,600 – MT 4,680",
      vipIncome: "MT 7,800+",
      daily: "Sell 15–20 bundles daily = MT 260+ daily profit!",
    },
  },
  {
    code: "NA",
    dial: "+264",
    usd: 0.055,
    name: "Namibia",
    flag: "🇳🇦",
    region: "Southern Africa",
    currency: "NAD",
    symbol: "N$",
    base: 40,
    round: 1,
    networks: [
      n("mtc", "MTC Namibia", "MTC", "mtn"),
      n("telecom", "TN Mobile Namibia", "TN Mobile", "telecel"),
    ],
    momo: [
      { label: "Mobile Money / Paystack", value: "FastData Africa" },
      { label: "WhatsApp support", value: "+233 503660497" },
    ],
    vendor: {
      starter: 320,
      vip: 640,
      starterIncome: "N$ 800 – N$ 1,440",
      vipIncome: "N$ 2,400+",
      daily: "Sell 15–20 bundles daily = N$ 80+ daily profit!",
    },
  },
  {
    code: "NE",
    dial: "+227",
    usd: 0.0016,
    name: "Niger",
    flag: "🇳🇪",
    region: "West Africa",
    currency: "XOF",
    symbol: "CFA",
    base: 900,
    round: 50,
    networks: [
      n("airtel", "Airtel Niger", "Airtel", "airtel"),
      n("moov", "Moov Africa Niger", "Moov Africa", "at"),
      n("zamani", "Zamani Niger", "Zamani", "mtn"),
    ],
    momo: [
      { label: "Mobile Money / Paystack", value: "FastData Africa" },
      { label: "WhatsApp support", value: "+233 503660497" },
    ],
    vendor: {
      starter: 7200,
      vip: 14400,
      starterIncome: "CFA 18,000 – CFA 32,400",
      vipIncome: "CFA 54,000+",
      daily: "Sell 15–20 bundles daily = CFA 1,800+ daily profit!",
    },
  },
  {
    code: "ST",
    dial: "+239",
    usd: 0.044,
    name: "São Tomé & Príncipe",
    flag: "🇸🇹",
    region: "Central Africa",
    currency: "STN",
    symbol: "Db",
    base: 50,
    round: 5,
    networks: [
      n("cstmovel", "CST São Tomé & Príncipe", "CST", "mtn"),
      n("unitel", "Unitel STP São Tomé & Príncipe", "Unitel STP", "telecel"),
    ],
    momo: [
      { label: "Mobile Money / Paystack", value: "FastData Africa" },
      { label: "WhatsApp support", value: "+233 503660497" },
    ],
    vendor: {
      starter: 400,
      vip: 800,
      starterIncome: "Db 1,000 – Db 1,800",
      vipIncome: "Db 3,000+",
      daily: "Sell 15–20 bundles daily = Db 100+ daily profit!",
    },
  },
  {
    code: "SC",
    dial: "+248",
    usd: 0.07,
    name: "Seychelles",
    flag: "🇸🇨",
    region: "East Africa",
    currency: "SCR",
    symbol: "₨",
    base: 30,
    round: 1,
    networks: [
      n("cable", "Cable & Wireless Seychelles", "Cable & Wireless", "mtn"),
      n("airtel", "Airtel Seychelles", "Airtel", "airtel"),
    ],
    momo: [
      { label: "Mobile Money / Paystack", value: "FastData Africa" },
      { label: "WhatsApp support", value: "+233 503660497" },
    ],
    vendor: {
      starter: 240,
      vip: 480,
      starterIncome: "₨ 600 – ₨ 1,080",
      vipIncome: "₨ 1,800+",
      daily: "Sell 15–20 bundles daily = ₨ 60+ daily profit!",
    },
  },
  {
    code: "SL",
    dial: "+232",
    usd: 0.044,
    name: "Sierra Leone",
    flag: "🇸🇱",
    region: "West Africa",
    currency: "SLE",
    symbol: "Le",
    base: 50,
    round: 5,
    networks: [
      n("orange", "Orange Sierra Leone", "Orange", "orange"),
      n("africell", "Africell Sierra Leone", "Africell", "telecel"),
    ],
    momo: [
      { label: "Mobile Money / Paystack", value: "FastData Africa" },
      { label: "WhatsApp support", value: "+233 503660497" },
    ],
    vendor: {
      starter: 400,
      vip: 800,
      starterIncome: "Le 1,000 – Le 1,800",
      vipIncome: "Le 3,000+",
      daily: "Sell 15–20 bundles daily = Le 100+ daily profit!",
    },
  },
  {
    code: "SO",
    dial: "+252",
    usd: 0.0018,
    name: "Somalia",
    flag: "🇸🇴",
    region: "East Africa",
    currency: "SOS",
    symbol: "Sh",
    base: 1100,
    round: 50,
    networks: [
      n("hormuud", "Hormuud Somalia", "Hormuud", "mtn"),
      n("somtel", "Somtel Somalia", "Somtel", "telecel"),
      n("telesom", "Telesom Somalia", "Telesom", "at"),
    ],
    momo: [
      { label: "Mobile Money / Paystack", value: "FastData Africa" },
      { label: "WhatsApp support", value: "+233 503660497" },
    ],
    vendor: {
      starter: 8800,
      vip: 17600,
      starterIncome: "Sh 22,000 – Sh 39,600",
      vipIncome: "Sh 66,000+",
      daily: "Sell 15–20 bundles daily = Sh 2,200+ daily profit!",
    },
  },
  {
    code: "SS",
    dial: "+211",
    usd: 0.00077,
    name: "South Sudan",
    flag: "🇸🇸",
    region: "East Africa",
    currency: "SSP",
    symbol: "SSP",
    base: 2600,
    round: 100,
    networks: [
      n("mtn", "MTN South Sudan", "MTN", "mtn"),
      n("zain", "Zain South Sudan", "Zain", "telecel"),
      n("digitel", "Digitel South Sudan", "Digitel", "at"),
    ],
    momo: [
      { label: "Mobile Money / Paystack", value: "FastData Africa" },
      { label: "WhatsApp support", value: "+233 503660497" },
    ],
    vendor: {
      starter: 20800,
      vip: 41600,
      starterIncome: "SSP 52,000 – SSP 93,600",
      vipIncome: "SSP 156,000+",
      daily: "Sell 15–20 bundles daily = SSP 5,200+ daily profit!",
    },
  },
  {
    code: "SD",
    dial: "+249",
    usd: 0.0017,
    name: "Sudan",
    flag: "🇸🇩",
    region: "North Africa",
    currency: "SDG",
    symbol: "SDG",
    base: 1200,
    round: 50,
    networks: [
      n("zain", "Zain Sudan", "Zain", "telecel"),
      n("mtn", "MTN Sudan", "MTN", "mtn"),
      n("sudani", "Sudani Sudan", "Sudani", "at"),
    ],
    momo: [
      { label: "Mobile Money / Paystack", value: "FastData Africa" },
      { label: "WhatsApp support", value: "+233 503660497" },
    ],
    vendor: {
      starter: 9600,
      vip: 19200,
      starterIncome: "SDG 24,000 – SDG 43,200",
      vipIncome: "SDG 72,000+",
      daily: "Sell 15–20 bundles daily = SDG 2,400+ daily profit!",
    },
  },
  {
    code: "TG",
    dial: "+228",
    usd: 0.0016,
    name: "Togo",
    flag: "🇹🇬",
    region: "West Africa",
    currency: "XOF",
    symbol: "CFA",
    base: 900,
    round: 50,
    networks: [
      n("togocom", "Togocom Togo", "Togocom", "mtn"),
      n("moov", "Moov Africa Togo", "Moov Africa", "at"),
    ],
    momo: [
      { label: "Mobile Money / Paystack", value: "FastData Africa" },
      { label: "WhatsApp support", value: "+233 503660497" },
    ],
    vendor: {
      starter: 7200,
      vip: 14400,
      starterIncome: "CFA 18,000 – CFA 32,400",
      vipIncome: "CFA 54,000+",
      daily: "Sell 15–20 bundles daily = CFA 1,800+ daily profit!",
    },
  },
  {
    code: "TN",
    dial: "+216",
    usd: 0.32,
    name: "Tunisia",
    flag: "🇹🇳",
    region: "North Africa",
    currency: "TND",
    symbol: "DT",
    base: 6,
    round: 1,
    networks: [
      n("ooredoo", "Ooredoo Tunisia", "Ooredoo", "telecel"),
      n("orange", "Orange Tunisia", "Orange", "orange"),
      n("tunisietelecom", "Tunisie Telecom Tunisia", "Tunisie Telecom", "mtn"),
    ],
    momo: [
      { label: "Mobile Money / Paystack", value: "FastData Africa" },
      { label: "WhatsApp support", value: "+233 503660497" },
    ],
    vendor: {
      starter: 48,
      vip: 96,
      starterIncome: "DT 120 – DT 216",
      vipIncome: "DT 360+",
      daily: "Sell 15–20 bundles daily = DT 12+ daily profit!",
    },
  },
  {
    code: "ZW",
    dial: "+263",
    usd: 0.031,
    name: "Zimbabwe",
    flag: "🇿🇼",
    region: "Southern Africa",
    currency: "ZWG",
    symbol: "Z$",
    base: 65,
    round: 5,
    networks: [
      n("econet", "Econet Zimbabwe", "Econet", "mtn"),
      n("netone", "NetOne Zimbabwe", "NetOne", "telecel"),
      n("telecel", "Telecel Zimbabwe", "Telecel", "at"),
    ],
    momo: [
      { label: "Mobile Money / Paystack", value: "FastData Africa" },
      { label: "WhatsApp support", value: "+233 503660497" },
    ],
    vendor: {
      starter: 520,
      vip: 1040,
      starterIncome: "Z$ 1,300 – Z$ 2,340",
      vipIncome: "Z$ 3,900+",
      daily: "Sell 15–20 bundles daily = Z$ 130+ daily profit!",
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
  "Central Africa",
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
