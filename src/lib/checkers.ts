export type CheckerKind = "wassce" | "bece" | "novdec" | "cssps";

export const CHECKERS: { id: CheckerKind; name: string; price: number }[] = [
  { id: "wassce", name: "WASSCE Results Checker", price: 25 },
  { id: "bece", name: "BECE Results Checker", price: 20 },
  { id: "novdec", name: "NOV/DEC Private Candidate Checker", price: 25 },
  { id: "cssps", name: "SHS Placement Checker / CSSPS", price: 15 },
];

export const checkerPrice = (id: string) => CHECKERS.find((c) => c.id === id)?.price ?? null;

/** Order item text encodes the kind and quantity: "WAEC:<kind>:<qty> <name>". */
export const checkerItem = (id: CheckerKind, qty: number) =>
  `WAEC:${id}:${qty} ${CHECKERS.find((c) => c.id === id)!.name} x${qty}`;

export function parseCheckerItem(item: string): { kind: CheckerKind; qty: number } | null {
  const m = /^WAEC:([a-z]+):(\d+)/.exec(item);
  if (!m || checkerPrice(m[1]!) === null) return null;
  return { kind: m[1] as CheckerKind, qty: Number(m[2]) };
}
