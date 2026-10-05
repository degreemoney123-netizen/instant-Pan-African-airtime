import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "en" | "fr" | "sw" | "tw";

export const LANGS: { id: Lang; label: string; short: string; flag: string }[] = [
  { id: "en", label: "English", short: "EN", flag: "🌐" },
  { id: "fr", label: "Français", short: "FR", flag: "🇫🇷" },
  { id: "sw", label: "Kiswahili", short: "SW", flag: "🇰🇪" },
  { id: "tw", label: "Twi", short: "TW", flag: "🇬🇭" },
];

const STORAGE_KEY = "fastdata-lang";

const en = {
  nav_track: "Track order",
  nav_account: "My account",
  nav_dashboard: "Dashboard",
  hero_badge: "Automated delivery · {n} markets live",
  hero_title1: "Stay connected",
  hero_title2: "across Africa.",
  hero_sub:
    "Instant non-expiry data bundles, airtime and utility bills — priced in {cur} and delivered in seconds.",
  pill_no_expiry: "No expiry",
  pill_local_currency: "Local currency",
  pill_support: "24/7 support",
  pill_bills: "ECG, TV & bills",
  bundles_title: "{net} bundles",
  non_expiry: "Non-expiry",
  featured_tag: "Most popular",
  one_off: "One-off",
  buy_now: "Buy Bundle Now",
  buy_package: "Buy Package",
  no_match: "No packages match “{q}”. Try another size or clear the filters.",
  pay_title: "Payment options in {flag} {name}",
  pay_sub: "Checkout auto-adjusts to {cur} for Paystack and Mobile Money.",
  how_title: "How it works & FAQ",
  step1: "1. Pick your country, network and bundle size.",
  step2: "2. Enter the recipient number and confirm the network.",
  step3: "3. Pay in your local currency, then confirm on WhatsApp.",
  faq_countries_q: "Which countries are supported?",
  faq_countries_a:
    "All of Africa — with more markets added every month. Prices show in each country's own currency.",
  faq_speed_q: "How fast is delivery?",
  faq_speed_a:
    "Most orders are processed automatically within 1–15 minutes, in every country we serve.",
  faq_currency_q: "What currency am I charged in?",
  faq_currency_a:
    "Always the currency of the country you select — {cur} right now. No hidden conversion at checkout.",
  faq_agent_q: "Can I become an agent outside Ghana?",
  faq_agent_a:
    "Yes. The vendor portal supports agents in every listed country, with local registration fees and local earnings potential.",
  lb_title: "Top vendors this month",
  lb_sub: "Our best-performing agents earn free data stock, VIP upgrades and cash bonuses.",
  lb_cta: "Become a vendor",
  lb_you: "Your shop could be here",
  lang: "Language",
  asst_title: "FastData Assistant",
  asst_sub: "AI-powered · replies instantly",
  asst_ph: "Ask about bundles, payment, vendors…",
  asst_open: "Chat with us",
};

export type TKey = keyof typeof en;

const fr: Record<TKey, string> = {
  nav_track: "Suivre ma commande",
  nav_account: "Mon compte",
  nav_dashboard: "Tableau de bord",
  hero_badge: "Livraison automatisée · {n} marchés actifs",
  hero_title1: "Restez connecté",
  hero_title2: "partout en Afrique.",
  hero_sub:
    "Forfaits data sans expiration, crédit et factures — au prix de {cur}, livrés en quelques secondes.",
  pill_no_expiry: "Sans expiration",
  pill_local_currency: "Monnaie locale",
  pill_support: "Assistance 24/7",
  pill_bills: "ECG, TV & factures",
  bundles_title: "Forfaits {net}",
  non_expiry: "Sans expiration",
  featured_tag: "Le plus populaire",
  one_off: "Paiement unique",
  buy_now: "Acheter ce forfait",
  buy_package: "Acheter",
  no_match: "Aucun forfait ne correspond à « {q} ». Essayez une autre taille ou effacez les filtres.",
  pay_title: "Options de paiement en {flag} {name}",
  pay_sub: "Le paiement s'ajuste automatiquement en {cur} pour Paystack et Mobile Money.",
  how_title: "Comment ça marche & FAQ",
  step1: "1. Choisissez votre pays, votre réseau et la taille du forfait.",
  step2: "2. Saisissez le numéro du bénéficiaire et confirmez le réseau.",
  step3: "3. Payez dans votre monnaie locale, puis confirmez sur WhatsApp.",
  faq_countries_q: "Quels pays sont pris en charge ?",
  faq_countries_a:
    "Toute l'Afrique — avec de nouveaux marchés chaque mois. Les prix s'affichent dans la monnaie de chaque pays.",
  faq_speed_q: "Quelle est la vitesse de livraison ?",
  faq_speed_a:
    "La plupart des commandes sont traitées automatiquement en 1 à 15 minutes, dans tous les pays desservis.",
  faq_currency_q: "Dans quelle monnaie suis-je facturé ?",
  faq_currency_a:
    "Toujours dans la monnaie du pays sélectionné — {cur} actuellement. Aucune conversion cachée au paiement.",
  faq_agent_q: "Puis-je devenir agent en dehors du Ghana ?",
  faq_agent_a:
    "Oui. L'espace vendeur prend en charge les agents de tous les pays listés, avec des frais et des gains locaux.",
  lb_title: "Meilleurs vendeurs du mois",
  lb_sub: "Nos meilleurs agents gagnent du stock data gratuit, des surclassements VIP et des primes.",
  lb_cta: "Devenir vendeur",
  lb_you: "Votre boutique pourrait être ici",
  lang: "Langue",
  asst_title: "Assistant FastData",
  asst_sub: "Propulsé par l'IA · répond instantanément",
  asst_ph: "Forfaits, paiement, vendeurs…",
  asst_open: "Discuter avec nous",
};

const sw: Record<TKey, string> = {
  nav_track: "Fuatilia oda",
  nav_account: "Akaunti yangu",
  nav_dashboard: "Dashibodi",
  hero_badge: "Uwasilishaji wa kiotomatiki · masoko {n} yako hai",
  hero_title1: "Baki ukiunganishwa",
  hero_title2: "barani Afrika.",
  hero_sub:
    "Vifurushi vya data isiyoisha, airtime na bili — kwa bei ya {cur}, vinafikishwa kwa sekunde chache.",
  pill_no_expiry: "Haina muda wa kuisha",
  pill_local_currency: "Sarafu ya ndani",
  pill_support: "Msaada saa 24",
  pill_bills: "ECG, TV na bili",
  bundles_title: "Vifurushi vya {net}",
  non_expiry: "Isiyoisha",
  featured_tag: "Maarufu zaidi",
  one_off: "Mara moja",
  buy_now: "Nunua Bundle Sasa",
  buy_package: "Nunua Kifurushi",
  no_match: "Hakuna kifurushi kinacholingana na “{q}”. Jaribu ukubwa mwingine au futa vichujio.",
  pay_title: "Njia za malipo {flag} {name}",
  pay_sub: "Malipo hubadilika kuwa {cur} kwa Paystack na Mobile Money.",
  how_title: "Inafanyaje kazi & Maswali",
  step1: "1. Chagua nchi yako, mtandao na ukubwa wa kifurushi.",
  step2: "2. Weka namba ya mlipaji na thibitisha mtandao.",
  step3: "3. Lipa kwa sarafu yako, kisha thibitisha kwa WhatsApp.",
  faq_countries_q: "Ni nchi zipi zinapatikana?",
  faq_countries_a:
    "Afrika yote — masoko mapya yanaongezwa kila mwezi. Bei zinaonekana kwa sarafu ya kila nchi.",
  faq_speed_q: "Uwasilishaji ni wa kasi gani?",
  faq_speed_a:
    "Oda nyingi zinakamilishwa kiotomatiki ndani ya dakika 1–15, katika kila nchi tunayohudumia.",
  faq_currency_q: "Ninalipwa kwa sarafu gani?",
  faq_currency_a:
    "Kila wakati sarafu ya nchi uliyochagua — {cur} kwa sasa. Hakuna ubadilishaji wa siri wakati wa kulipa.",
  faq_agent_q: "Naweza kuwa wakala nje ya Ghana?",
  faq_agent_a:
    "Ndiyo. Portal ya wauzaji inaunga mkono wakala katika kila nchi, kwa ada na mapato ya ndani.",
  lb_title: "Wauzaji bora wa mwezi huu",
  lb_sub: "Wakala bora zinashinda stock ya data bure, daraja la VIP na bonasi za pesa.",
  lb_cta: "Kuwa muuzaji",
  lb_you: "Duka lako linaweza kuwa hapa",
  lang: "Lugha",
  asst_title: "Msaidizi wa FastData",
  asst_sub: "Inatumia AI · hujibu papo hapo",
  asst_ph: "Uliza kuhusu vifurushi, malipo…",
  asst_open: "Zungumza nasi",
};

const tw: Record<TKey, string> = {
  nav_track: "Hwɛ wo order",
  nav_account: "Me akawnt",
  nav_dashboard: "Dashboard",
  hero_badge: "Ntɛm delivery · amanaman {n} so",
  hero_title1: "Wo ho te so",
  hero_title2: "wɔ Afrika nyinaa.",
  hero_sub:
    "Data a ɛnni dum, airtime ne bills — wɔ {cur} mu, na ɛduru wɔ sima kakraa bi mu.",
  pill_no_expiry: "Ɛnni dum",
  pill_local_currency: "Wo man sika",
  pill_support: "Mmoa daa",
  pill_bills: "ECG, TV ne bills",
  bundles_title: "{net} bundles",
  non_expiry: "Ɛnni dum",
  featured_tag: "Nea wɔpɛ",
  one_off: "Prɛko pɛ",
  buy_now: "Tɔ Bundle no",
  buy_package: "Tɔ Package yi",
  no_match: "Bundle biara nni ho a ɛne “{q}” hyia. Hwɛ size foforɔ anaagyɛ fiti no.",
  pay_title: "Sika tua akwan wɔ {flag} {name}",
  pay_sub: "Wobɛtua wɔ {cur} mu — Paystack ne Mobile Money.",
  how_title: "Ɛyɛ dɛn & Bɛsɛ",
  step1: "1. Paw wo man, network ne bundle size.",
  step2: "2. Bɛa wo phone number no na hwɛ network no so.",
  step3: "3. Tua wɔ wo sika mu, na kasa wɔ WhatsApp so.",
  faq_countries_q: "Aman bɛn na ɛwɔ hɔ?",
  faq_countries_a:
    "Afrika nyinaa — amanaman foforɔ ba biara bosome mu. Ɛka sika a ɛwɔ amanaman biara mu.",
  faq_speed_q: "Delivery no yɛ ntɛm sɛn?",
  faq_speed_a:
    "Orders dodow yɛ wɔn ho wɔn mu wɔ sima 1–15 mu, amanaman nyinaa mu.",
  faq_currency_q: "Mɛtua sika bɛn so?",
  faq_currency_a:
    "Sika a ɛwɔ wo man mu nko ara — {cur} seesei. Nsɛso biara nni ho.",
  faq_agent_q: "Metumi ayɛ agent wɔ Ghana akyi?",
  faq_agent_a:
    "Aane. Vendor portal no boa amanaman nyinaa, ne sika ne akatua a ɛfata.",
  lb_title: "Vendor akɛse bosome yi",
  lb_sub: "Agent akɛse nya data ho ka, VIP ne sika akatua.",
  lb_cta: "Yɛ vendor",
  lb_you: "Wo duku betumi aba ha",
  lang: "Kasa",
  asst_title: "FastData Ɔboafo",
  asst_sub: "AI nti · ɛka ntɛm",
  asst_ph: "Bisa fa bundles, sika…",
  asst_open: "Kasa yɛn",
};

const DICTS: Record<Lang, Record<TKey, string>> = { en, fr, sw, tw };

type LangContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TKey, vars?: Record<string, string | number>) => string;
};

const LangContext = createContext<LangContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (stored && stored in DICTS) {
      setLangState(stored);
      return;
    }
    const nav = navigator.language.slice(0, 2).toLowerCase();
    if (nav === "fr") setLangState("fr");
    else if (nav === "sw") setLangState("sw");
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const t = useCallback(
    (key: TKey, vars?: Record<string, string | number>) => {
      let text: string = DICTS[lang][key] ?? DICTS.en[key];
      if (vars) {
        for (const [name, value] of Object.entries(vars)) {
          text = text.replaceAll(`{${name}}`, String(value));
        }
      }
      return text;
    },
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside <LanguageProvider>");
  return ctx;
}
