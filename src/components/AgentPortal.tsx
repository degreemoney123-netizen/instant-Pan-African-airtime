import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Copy, Wallet } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ACCENT_BUTTON,
  AGENT_DISCOUNT,
  agentPrice,
  bundlesFor,
  formatMoney,
  waLink,
  type Country,
} from "@/lib/fastdata";

const STORAGE_KEY = "fastdata-agent-wallet";

type AgentState = { balance: number; commission: number; volume: number; orders: number };

const DEFAULT_STATE: AgentState = {
  balance: 1240,
  commission: 3180,
  volume: 26450,
  orders: 412,
};

/** Scale demo figures from the Ghana base into the selected currency. */
const scaleTo = (country: Country, ghs: number) => {
  const factor = 0.083 / country.usd;
  return Math.max(country.round, Math.round((ghs * factor) / country.round) * country.round);
};

export function AgentPortal({ country }: { country: Country }) {
  const [state, setState] = useState<AgentState>(DEFAULT_STATE);
  const [depositOpen, setDepositOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [agentCode, setAgentCode] = useState("FD-AGENT");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...DEFAULT_STATE, ...(JSON.parse(raw) as Partial<AgentState>) });
      let code = localStorage.getItem("fastdata-agent-code");
      if (!code) {
        code = `FD-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
        localStorage.setItem("fastdata-agent-code", code);
      }
      setAgentCode(code);
    } catch {
      /* storage unavailable — keep defaults */
    }
  }, []);

  const persist = (next: AgentState) => {
    setState(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const metrics = useMemo(
    () => [
      { label: "Wallet balance", value: formatMoney(country, scaleTo(country, state.balance)) },
      {
        label: "Commission earned",
        value: formatMoney(country, scaleTo(country, state.commission)),
      },
      { label: "Sales volume", value: formatMoney(country, scaleTo(country, state.volume)) },
      { label: "Orders completed", value: state.orders.toLocaleString("en-US") },
    ],
    [country, state],
  );

  const wholesale = useMemo(() => bundlesFor(country, 0).slice(0, 6), [country]);
  const referral =
    typeof window === "undefined"
      ? `https://fastdataafrica.com/?ref=${agentCode}`
      : `${window.location.origin}/?ref=${agentCode}`;

  const copyReferral = async () => {
    try {
      await navigator.clipboard.writeText(referral);
      toast.success("Referral link copied");
    } catch {
      toast.error("Copy failed — select and copy the link manually");
    }
  };

  const deposit = () => {
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      toast.error("Enter a valid top-up amount");
      return;
    }
    persist({ ...state, balance: state.balance + value / (0.083 / country.usd) });
    setDepositOpen(false);
    setAmount("");
    toast.success(`Wallet credited with ${formatMoney(country, value)}`);
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Agent portal</h2>
        <p className="text-sm text-muted-foreground">
          Wallet, wholesale pricing and referrals for authorised FastData agents.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-2xl border border-border bg-card p-4 shadow-card">
            <p className="text-xs text-muted-foreground">{m.label}</p>
            <p className="mt-1 text-xl font-extrabold">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-bold">
              <Wallet className="size-4" /> Deposit funds
            </h3>
            <p className="text-sm text-muted-foreground">
              Top up instantly with MoMo or Paystack and pay for bundles from your balance.
            </p>
          </div>
          <Button className="h-11" onClick={() => setDepositOpen(true)}>
            Top up wallet
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <h3 className="text-lg font-bold">Wholesale store</h3>
        <p className="text-sm text-muted-foreground">
          {Math.round(AGENT_DISCOUNT * 100)}% agent discount on every bundle in {country.flag}{" "}
          {country.name}.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-3">
          {wholesale.map((b) => (
            <article key={b.size} className="rounded-2xl border border-border bg-secondary p-4">
              <p className="text-xl font-extrabold">{b.size}</p>
              <p className="text-xs text-muted-foreground line-through">
                {formatMoney(country, b.price)}
              </p>
              <p className="text-base font-bold">{formatMoney(country, agentPrice(country, b.price))}</p>
              <Button
                variant={ACCENT_BUTTON[country.networks[0]!.accent]}
                className="mt-3 h-10 w-full"
                onClick={() => {
                  const cost = agentPrice(country, b.price);
                  const ghs = cost / (0.083 / country.usd);
                  if (state.balance < ghs) {
                    toast.error("Insufficient wallet balance — top up first");
                    return;
                  }
                  persist({
                    ...state,
                    balance: state.balance - ghs,
                    commission: state.commission + (b.price - cost) / (0.083 / country.usd),
                    volume: state.volume + ghs,
                    orders: state.orders + 1,
                  });
                  toast.success(`${b.size} bought at wholesale — wallet debited`);
                }}
              >
                Buy wholesale
              </Button>
            </article>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <h3 className="text-lg font-bold">Referral link</h3>
        <p className="text-sm text-muted-foreground">
          Earn commission on every order placed through your link.
        </p>
        <div className="mt-3 flex gap-2">
          <Input readOnly value={referral} className="h-11" />
          <Button className="h-11 px-4" onClick={() => void copyReferral()}>
            <Copy className="size-4" />
          </Button>
        </div>
        <Button asChild variant="whatsapp" className="mt-3 h-11 w-full">
          <a
            href={waLink(`Buy instant non-expiry data on FastData Africa: ${referral}`)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Share on WhatsApp
          </a>
        </Button>
      </div>

      <Dialog open={depositOpen} onOpenChange={setDepositOpen}>
        <DialogContent className="max-w-[92vw] rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Top up agent wallet</DialogTitle>
            <DialogDescription>
              Funds are credited in {country.currency} via MoMo or Paystack.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topup">Amount ({country.currency})</Label>
              <Input
                id="topup"
                inputMode="decimal"
                placeholder="100"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-12"
              />
            </div>
            <ul className="rounded-2xl border border-border bg-secondary p-4 text-sm">
              {country.momo.map((m) => (
                <li key={m.label} className="flex justify-between gap-3 py-1">
                  <span className="text-muted-foreground">{m.label}</span>
                  <button
                    type="button"
                    className="font-semibold underline-offset-4 hover:underline"
                    onClick={() => {
                      void navigator.clipboard
                        .writeText(m.value)
                        .then(() => toast.success(`${m.label} copied`))
                        .catch(() => toast.error("Copy failed"));
                    }}
                  >
                    {m.value}
                  </button>
                </li>
              ))}
            </ul>
            <Button className="h-12 w-full text-base" onClick={deposit}>
              Confirm top-up
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
