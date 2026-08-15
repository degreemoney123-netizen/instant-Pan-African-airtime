import { useState } from "react";
import { CountrySelect } from "@/components/CountrySelect";
import { Input } from "@/components/ui/input";
import { formatMoney, formatUsd, toUsd, type Country } from "@/lib/fastdata";

export function CountryRegionBar({
  country,
  onChange,
}: {
  country: Country;
  onChange: (c: Country) => void;
}) {
  const [amount, setAmount] = useState("100");
  const value = Number(amount.replace(/[^0-9.]/g, "")) || 0;

  return (
    <div className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/10 p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-wide text-primary-foreground/70">
          Select country / region
        </span>
        <span className="rounded-full bg-primary-foreground/15 px-2.5 py-1 text-xs font-bold">
          {country.dial}
        </span>
      </div>

      <CountrySelect
        value={country}
        onChange={onChange}
        className="mt-2 h-12 w-full rounded-xl border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground"
      />

      <div className="mt-3 flex flex-wrap gap-1.5">
        {country.networks.map((n) => (
          <span
            key={n.id}
            className="rounded-full bg-primary-foreground/15 px-2.5 py-1 text-[11px] font-semibold"
          >
            {n.short}
          </span>
        ))}
      </div>

      <div className="mt-4 rounded-xl bg-primary-foreground/10 p-3">
        <p className="text-xs font-bold uppercase tracking-wide text-primary-foreground/70">
          Currency converter
        </p>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm font-bold">{country.symbol}</span>
          <Input
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            aria-label={`Amount in ${country.currency}`}
            className="h-10 flex-1 border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50"
          />
        </div>
        <p className="mt-2 text-sm text-primary-foreground/80">
          {formatMoney(country, value)} ≈{" "}
          <span className="font-bold text-primary-foreground">{formatUsd(toUsd(country, value))}</span>{" "}
          <span className="text-xs">({country.currency} · indicative rate)</span>
        </p>
      </div>
    </div>
  );
}
