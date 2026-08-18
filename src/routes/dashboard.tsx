import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { COUNTRIES, formatMoney, type Country } from "@/lib/fastdata";
import { CountrySelect } from "@/components/CountrySelect";
import { SiteFooter } from "@/components/SiteFooter";

const title = "Merchant Analytics Dashboard — FastData Africa";
const description =
  "Demo admin dashboard tracking transactions, gross revenue, agent payouts and net profit margins across data, airtime and utility sales.";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DashboardPage,
});

const MONTHS = ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
const BASE = [
  { txns: 1840, gross: 41200 },
  { txns: 2110, gross: 47800 },
  { txns: 2460, gross: 55400 },
  { txns: 2280, gross: 52100 },
  { txns: 2890, gross: 64700 },
  { txns: 3240, gross: 73900 },
  { txns: 3610, gross: 82300 },
];

const CATEGORIES = [
  { name: "Data bundles", share: 0.52, margin: 0.14 },
  { name: "Airtime", share: 0.21, margin: 0.06 },
  { name: "ECG power", share: 0.15, margin: 0.09 },
  { name: "TV & water", share: 0.09, margin: 0.11 },
  { name: "Branding", share: 0.03, margin: 0.42 },
];

const CAT_COLORS = [
  "var(--mtn)",
  "var(--at)",
  "var(--telecel)",
  "var(--whatsapp)",
  "var(--primary)",
];

function DashboardPage() {
  const [country, setCountry] = useState<Country>(COUNTRIES[0] as Country);
  const [range, setRange] = useState<3 | 7>(7);

  const rate = 0.083 / (country.usd || 0.083);

  const rows = useMemo(() => {
    const slice = BASE.slice(BASE.length - range);
    const months = MONTHS.slice(MONTHS.length - range);
    return slice.map((r, i) => {
      const gross = Math.round(r.gross * rate);
      const payouts = Math.round(gross * 0.62);
      const costs = Math.round(gross * 0.27);
      return {
        month: months[i]!,
        txns: r.txns,
        gross,
        payouts,
        net: gross - payouts - costs,
      };
    });
  }, [range, rate]);

  const totals = rows.reduce(
    (a, r) => ({
      txns: a.txns + r.txns,
      gross: a.gross + r.gross,
      payouts: a.payouts + r.payouts,
      net: a.net + r.net,
    }),
    { txns: 0, gross: 0, payouts: 0, net: 0 },
  );

  const margin = totals.gross ? (totals.net / totals.gross) * 100 : 0;
  const last = rows[rows.length - 1]!;
  const prev = rows[rows.length - 2] ?? last;
  const growth = prev.gross ? ((last.gross - prev.gross) / prev.gross) * 100 : 0;

  const catData = CATEGORIES.map((c) => ({
    name: c.name,
    value: Math.round(totals.gross * c.share),
    margin: Math.round(c.margin * 100),
  }));

  const money = (v: number) => formatMoney(country, v);

  const cards = [
    { label: "Total transactions", value: totals.txns.toLocaleString(), sub: `${range} months` },
    { label: "Gross revenue", value: money(totals.gross), sub: `${growth >= 0 ? "+" : ""}${growth.toFixed(1)}% MoM` },
    { label: "Payouts owed to agents", value: money(totals.payouts), sub: "62% of gross" },
    { label: "Net profit", value: money(totals.net), sub: `${margin.toFixed(1)}% margin` },
  ];

  return (
    <div className="min-h-screen pb-10">
      <header className="bg-hero px-4 pb-10 pt-5 text-primary-foreground">
        <div className="mx-auto max-w-md">
          <div className="flex items-center justify-between gap-2">
            <Link to="/" className="text-xs font-bold underline-offset-2 hover:underline">
              ← Back to store
            </Link>
            <span className="rounded-full bg-primary-foreground/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wide">
              Demo data
            </span>
          </div>
          <h1 className="mt-4 text-2xl font-extrabold leading-tight">
            Admin &amp; Merchant Analytics
          </h1>
          <p className="mt-2 text-sm text-primary-foreground/80">
            Track transactions, revenue, agent payouts and profit margins on airtime, data and
            utility sales.
          </p>
          <div className="mt-4">
            <CountrySelect value={country} onChange={setCountry} />
          </div>
        </div>
      </header>

      <main className="mx-auto -mt-6 max-w-md px-4">
        <div className="mb-8">
          <AgentPortal country={country} />
        </div>

        <h2 className="mb-3 text-xl font-bold">Merchant analytics</h2>
        <div className="flex gap-2 rounded-2xl bg-card p-2 shadow-card">
          {([3, 7] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={`flex-1 rounded-xl px-3 py-2.5 text-sm font-bold transition ${
                range === r ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              Last {r} months
            </button>
          ))}
        </div>

        <section className="mt-4 grid grid-cols-2 gap-3">
          {cards.map((c) => (
            <article
              key={c.label}
              className="rounded-2xl border border-border bg-card p-4 shadow-card"
            >
              <p className="text-xs text-muted-foreground">{c.label}</p>
              <p className="mt-1 text-lg font-extrabold leading-tight">{c.value}</p>
              <p className="mt-1 text-[11px] font-semibold text-muted-foreground">{c.sub}</p>
            </article>
          ))}
        </section>

        <section className="mt-6 rounded-2xl border border-border bg-card p-4 shadow-card">
          <h2 className="text-sm font-bold">Gross revenue vs net profit</h2>
          <div className="mt-3 h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={rows} margin={{ left: -18, right: 6, top: 6 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" fontSize={11} stroke="var(--muted-foreground)" />
                <YAxis fontSize={10} stroke="var(--muted-foreground)" width={52} />
                <Tooltip formatter={(v: number) => money(Number(v))} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area
                  type="monotone"
                  dataKey="gross"
                  name="Gross"
                  stroke="var(--primary)"
                  fill="var(--primary)"
                  fillOpacity={0.18}
                />
                <Area
                  type="monotone"
                  dataKey="net"
                  name="Net profit"
                  stroke="var(--whatsapp)"
                  fill="var(--whatsapp)"
                  fillOpacity={0.22}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="mt-4 rounded-2xl border border-border bg-card p-4 shadow-card">
          <h2 className="text-sm font-bold">Agent payouts owed</h2>
          <div className="mt-3 h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rows} margin={{ left: -18, right: 6, top: 6 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" fontSize={11} stroke="var(--muted-foreground)" />
                <YAxis fontSize={10} stroke="var(--muted-foreground)" width={52} />
                <Tooltip formatter={(v: number) => money(Number(v))} />
                <Bar dataKey="payouts" name="Payouts" fill="var(--mtn)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="mt-4 rounded-2xl border border-border bg-card p-4 shadow-card">
          <h2 className="text-sm font-bold">Transaction volume</h2>
          <div className="mt-3 h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rows} margin={{ left: -18, right: 6, top: 6 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" fontSize={11} stroke="var(--muted-foreground)" />
                <YAxis fontSize={10} stroke="var(--muted-foreground)" width={44} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="txns"
                  name="Transactions"
                  stroke="var(--at)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="mt-4 rounded-2xl border border-border bg-card p-4 shadow-card">
          <h2 className="text-sm font-bold">Revenue mix by product</h2>
          <div className="mt-2 h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={catData} dataKey="value" nameKey="name" innerRadius={44} outerRadius={72}>
                  {catData.map((_, i) => (
                    <Cell key={i} fill={CAT_COLORS[i % CAT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => money(Number(v))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-2">
            {catData.map((c, i) => (
              <li key={c.name} className="flex items-center justify-between gap-2 text-xs">
                <span className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: CAT_COLORS[i % CAT_COLORS.length] }}
                  />
                  {c.name}
                </span>
                <span className="font-semibold">
                  {money(c.value)} · {c.margin}% margin
                </span>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-4 text-center text-[11px] text-muted-foreground">
          Figures are simulated demo data for illustration only.
        </p>

        <SiteFooter />
      </main>
    </div>
  );
}
