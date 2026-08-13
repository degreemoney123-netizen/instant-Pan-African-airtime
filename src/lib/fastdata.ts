export const ADMIN_WHATSAPP = "233503660497";

export type NetworkId = "mtn" | "telecel" | "at";

export type Network = {
  id: NetworkId;
  name: string;
  short: string;
  accent: string; // tailwind bg class token
  text: string;
  ring: string;
};

export const NETWORKS: Network[] = [
  {
    id: "mtn",
    name: "MTN Ghana",
    short: "MTN",
    accent: "bg-mtn text-mtn-foreground",
    text: "text-mtn",
    ring: "ring-mtn",
  },
  {
    id: "telecel",
    name: "Telecel Ghana",
    short: "Telecel",
    accent: "bg-telecel text-telecel-foreground",
    text: "text-telecel",
    ring: "ring-telecel",
  },
  {
    id: "at",
    name: "AT Ghana",
    short: "AT",
    accent: "bg-at text-at-foreground",
    text: "text-at",
    ring: "ring-at",
  },
];

export type Bundle = { size: string; price: number; tag?: string };

const priceTable: Record<NetworkId, number[]> = {
  mtn: [6, 16, 26, 48, 90, 220, 425],
  telecel: [5, 14, 23, 44, 84, 205, 400],
  at: [4, 12, 20, 39, 75, 185, 360],
};

const sizes = ["1GB", "3GB", "5GB", "10GB", "20GB", "50GB", "100GB"];
const tags: Record<string, string | undefined> = {
  "3GB": "Popular",
  "10GB": "Best value",
  "50GB": "Bulk",
};

export const bundlesFor = (id: NetworkId): Bundle[] =>
  sizes.map((size, i) => ({ size, price: priceTable[id][i], tag: tags[size] }));

export const MOMO = [
  { label: "MTN MoMo Merchant", value: "FastData GH · 059 366 0497" },
  { label: "Telecel Cash", value: "FastData GH · 050 366 0497" },
  { label: "Merchant ID", value: "FDGH-0497" },
];

export const waLink = (message: string) =>
  `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message.slice(0, 900))}`;

export const isValidGhNumber = (v: string) => /^0\d{9}$/.test(v.replace(/\s+/g, ""));
