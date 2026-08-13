import { COUNTRIES, REGIONS, type Country } from "@/lib/fastdata";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CountrySelect({
  value,
  onChange,
  className,
}: {
  value: Country;
  onChange: (c: Country) => void;
  className?: string;
}) {
  return (
    <Select
      value={value.code}
      onValueChange={(code) => {
        const c = COUNTRIES.find((x) => x.code === code);
        if (c) onChange(c);
      }}
    >
      <SelectTrigger className={className} aria-label="Select country">
        <SelectValue>
          <span className="flex items-center gap-2">
            <span aria-hidden>{value.flag}</span>
            <span className="font-semibold">{value.name}</span>
            <span className="text-xs opacity-70">{value.currency}</span>
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-80">
        {REGIONS.map((region) => (
          <SelectGroup key={region}>
            <SelectLabel>{region}</SelectLabel>
            {COUNTRIES.filter((c) => c.region === region).map((c) => (
              <SelectItem key={c.code} value={c.code}>
                <span className="flex items-center gap-2">
                  <span aria-hidden>{c.flag}</span>
                  {c.name}
                  <span className="text-xs text-muted-foreground">{c.currency}</span>
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
