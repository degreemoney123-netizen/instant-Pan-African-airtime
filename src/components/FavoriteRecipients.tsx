import { X } from "lucide-react";
import type { FavoriteRecipient } from "@/lib/favorites";

export interface FavoriteRecipientsProps {
  favorites: FavoriteRecipient[];
  activeNumber: string;
  onSelect: (fav: FavoriteRecipient) => void;
  onRemove: (id: string) => void;
}

export function FavoriteRecipients({
  favorites,
  activeNumber,
  onSelect,
  onRemove,
}: FavoriteRecipientsProps) {
  if (favorites.length === 0) return null;

  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold text-muted-foreground">Saved recipients</p>
      <div className="flex flex-wrap gap-2">
        {favorites.map((f) => {
          const active = activeNumber === f.number;
          return (
            <span
              key={f.id}
              className={`inline-flex items-center gap-1 rounded-full border px-1 text-xs transition ${
                active ? "border-primary bg-secondary" : "border-border bg-card"
              }`}
            >
              <button
                type="button"
                onClick={() => onSelect(f)}
                className="py-1.5 pl-2 font-semibold"
              >
                {f.label}
                <span className="ml-1.5 font-normal text-muted-foreground">{f.number}</span>
              </button>
              <button
                type="button"
                aria-label={`Remove ${f.label}`}
                onClick={() => onRemove(f.id)}
                className="rounded-full p-1 text-muted-foreground hover:text-destructive"
              >
                <X className="size-3" />
              </button>
            </span>
          );
        })}
      </div>
    </div>
  );
}
