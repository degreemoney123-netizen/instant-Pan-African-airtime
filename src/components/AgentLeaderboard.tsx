type Agent = {
  rank: number;
  name: string;
  flag: string;
  location: string;
  tier: "Platinum" | "Gold" | "Silver";
  bundles: number;
  earnings: string;
  streak: string;
};

const LEADERBOARD: Agent[] = [
  {
    rank: 1,
    name: "Kwame Boateng",
    flag: "🇬🇭",
    location: "Kumasi, Ghana",
    tier: "Platinum",
    bundles: 1284,
    earnings: "GH₵ 9,630",
    streak: "6 months top 3",
  },
  {
    rank: 2,
    name: "Aisha Bello",
    flag: "🇳🇬",
    location: "Lagos, Nigeria",
    tier: "Platinum",
    bundles: 1102,
    earnings: "₦210,400",
    streak: "4 months top 3",
  },
  {
    rank: 3,
    name: "Grace Wanjiku",
    flag: "🇰🇪",
    location: "Nairobi, Kenya",
    tier: "Gold",
    bundles: 986,
    earnings: "KSh 74,500",
    streak: "3 months top 3",
  },
  {
    rank: 4,
    name: "Yao Kouassi",
    flag: "🇨🇮",
    location: "Abidjan, Côte d'Ivoire",
    tier: "Gold",
    bundles: 874,
    earnings: "CFA 385,000",
    streak: "2 months top 5",
  },
  {
    rank: 5,
    name: "Themba Dlamini",
    flag: "🇿🇦",
    location: "Durban, South Africa",
    tier: "Gold",
    bundles: 812,
    earnings: "R 21,800",
    streak: "2 months top 5",
  },
  {
    rank: 6,
    name: "Fatou Ndiaye",
    flag: "🇸🇳",
    location: "Dakar, Senegal",
    tier: "Silver",
    bundles: 730,
    earnings: "CFA 296,000",
    streak: "1 month top 5",
  },
  {
    rank: 7,
    name: "Musa Okello",
    flag: "🇺🇬",
    location: "Kampala, Uganda",
    tier: "Silver",
    bundles: 664,
    earnings: "UGX 4.1M",
    streak: "Rising star",
  },
];

const TIER_STYLES: Record<Agent["tier"], string> = {
  Platinum: "bg-navy text-gold",
  Gold: "bg-gold/20 text-navy",
  Silver: "bg-secondary text-muted-foreground",
};

const MEDALS: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

export function AgentLeaderboard() {
  const top3 = LEADERBOARD.slice(0, 3);
  const rest = LEADERBOARD.slice(3);

  return (
    <section className="mt-8 px-4">
      <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gold">
              🏆 Agent Network
            </p>
            <h2 className="mt-1 font-display text-xl font-bold">Top vendors this month</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Our best-performing agents win free data stock, VIP upgrades and cash bonuses —
              every single month.
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {top3.map((a) => (
            <div
              key={a.rank}
              className={`flex flex-col items-center rounded-2xl border p-3 text-center ${
                a.rank === 1
                  ? "border-gold/40 bg-gold/10"
                  : "border-border bg-surface"
              }`}
            >
              <span className="text-lg">{MEDALS[a.rank]}</span>
              <p className="mt-1 text-[11px] font-bold leading-tight">
                {a.flag} {a.name.split(" ")[0]}
              </p>
              <p className="text-[9px] text-muted-foreground">{a.location}</p>
              <span
                className={`mt-2 rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide ${TIER_STYLES[a.tier]}`}
              >
                {a.tier}
              </span>
              <p className="mt-2 font-display text-sm font-bold">{a.bundles.toLocaleString()}</p>
              <p className="text-[9px] text-muted-foreground">bundles sold</p>
            </div>
          ))}
        </div>

        <ul className="mt-3 divide-y divide-border">
          {rest.map((a) => (
            <li key={a.rank} className="flex items-center justify-between gap-2 py-2.5">
              <div className="flex min-w-0 items-center gap-2">
                <span className="w-5 text-center font-display text-sm font-bold text-muted-foreground">
                  {a.rank}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold">
                    {a.flag} {a.name}
                  </p>
                  <p className="truncate text-[10px] text-muted-foreground">{a.streak}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold">{a.earnings}</p>
                <p className="text-[9px] text-muted-foreground">{a.bundles.toLocaleString()} bundles</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-3 rounded-2xl bg-navy p-4 text-primary-foreground">
          <p className="font-display text-sm font-bold text-gold">Your shop could be here 🚀</p>
          <p className="mt-1 text-xs text-primary-foreground/70">
            Vendors buy wholesale, sell at retail and keep the margin. Top sellers are featured
            right here for thousands of daily buyers to see.
          </p>
          <a
            href="#vendor"
            className="mt-3 inline-flex items-center justify-center rounded-full bg-gold px-4 py-2 text-xs font-bold text-navy"
          >
            Become a vendor
          </a>
        </div>
      </div>
    </section>
  );
}
