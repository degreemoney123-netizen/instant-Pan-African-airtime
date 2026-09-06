export interface FavoriteRecipient {
  id: string;
  label: string;
  number: string;
  network: string;
}

const KEY = "fastdata.favorites.v1";

const isFavorite = (v: unknown): v is FavoriteRecipient =>
  typeof v === "object" &&
  v !== null &&
  typeof (v as FavoriteRecipient).id === "string" &&
  typeof (v as FavoriteRecipient).label === "string" &&
  typeof (v as FavoriteRecipient).number === "string" &&
  typeof (v as FavoriteRecipient).network === "string";

export function loadFavorites(): FavoriteRecipient[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isFavorite) : [];
  } catch {
    return [];
  }
}

export function saveFavorites(list: FavoriteRecipient[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list.slice(0, 20)));
  } catch {
    /* storage unavailable */
  }
}

export function addFavorite(entry: Omit<FavoriteRecipient, "id">): FavoriteRecipient[] {
  const list = loadFavorites().filter((f) => f.number !== entry.number);
  const next: FavoriteRecipient[] = [
    { ...entry, id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}` },
    ...list,
  ];
  saveFavorites(next);
  return next;
}

export function removeFavorite(id: string): FavoriteRecipient[] {
  const next = loadFavorites().filter((f) => f.id !== id);
  saveFavorites(next);
  return next;
}
