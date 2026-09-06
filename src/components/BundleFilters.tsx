import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Bundle } from "@/lib/fastdata";

export type BundleFilterId = "all" | "non-expiry" | "best-value" | "bulk";

export interface BundleFilterChip {
  id: BundleFilterId;
  label: string;
}

export const BUNDLE_FILTERS: BundleFilterChip[] = [
  { id: "all", label: "All" },
  { id: "non-expiry", label: "Non-Expiry" },
  { id: "best-value", label: "Best Value" },
  { id: "bulk", label: "Bulk" },
];

export interface BundleFiltersProps {
  query: string;
  filter: BundleFilterId;
  onQueryChange: (v: string) => void;
  onFilterChange: (v: BundleFilterId) => void;
  placeholder: string;
}

const gigabytes = (size: string): number => {
  const n = parseFloat(size);
  if (!Number.isFinite(n)) return 0;
  return /mb/i.test(size) ? n / 1024 : n;
};

/** Filters bundles by free-text search (size or price) and the active chip. */
export function filterBundles(
  bundles: Bundle[],
  query: string,
  filter: BundleFilterId,
): Bundle[] {
  const q = query.trim().toLowerCase();
  const numeric = q.replace(/[^0-9.]/g, "");

  return bundles.filter((b) => {
    if (filter === "best-value" && b.tag !== "Best value" && b.tag !== "Popular") return false;
    if (filter === "bulk" && gigabytes(b.size) < 20) return false;
    if (!q) return true;

    const haystack = `${b.size} ${b.tag ?? ""} non-expiry`.toLowerCase();
    if (haystack.includes(q)) return true;
    if (numeric && b.size.toLowerCase().startsWith(numeric)) return true;
    if (numeric && String(Math.round(b.price)).startsWith(numeric)) return true;
    return false;
  });
}

export function BundleFilters({
  query,
  filter,
  onQueryChange,
  onFilterChange,
  placeholder,
}: BundleFiltersProps) {
  return (
    <div className="mt-4 space-y-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={placeholder}
          aria-label="Search bundles"
          className="h-12 pl-9 text-base"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {BUNDLE_FILTERS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onFilterChange(c.id)}
            className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${
              filter === c.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}
