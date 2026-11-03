import assert from "node:assert/strict";
import { COUNTRIES, SIZES, bundlesFor } from "@/lib/fastdata";

/**
 * Runs with: bun run src/lib/prices.test.ts
 * Pins the Ghana retail prices Henry set and proves nothing else moved.
 */

const gh = COUNTRIES.find((c) => c.code === "GH");
assert.ok(gh, "Ghana must be in the catalogue");

const priceFor = (size: string, networkIndex = 0) =>
  bundlesFor(gh, networkIndex).find((b) => b.size === size)?.price;

// Retail prices Henry set — on every Ghana network (MTN, Telecel, AirtelTigo).
for (const networkIndex of [0, 1, 2]) {
  assert.equal(priceFor("1GB", networkIndex), 7, `1GB on network ${networkIndex}`);
  assert.equal(priceFor("5GB", networkIndex), 22, `5GB on network ${networkIndex}`);
  assert.equal(priceFor("10GB", networkIndex), 43, `10GB on network ${networkIndex}`);
}

// Sizes are the package ids DataHub routing is derived from — they must not change.
assert.deepEqual(SIZES, ["1GB", "3GB", "5GB", "10GB", "20GB", "50GB", "100GB"]);

// Sizes Henry did not re-price keep their previous values.
assert.equal(priceFor("3GB"), 16, "3GB must stay at GH₵ 16");
assert.equal(priceFor("20GB"), 87, "20GB must stay at GH₵ 87");
assert.equal(priceFor("50GB"), 204, "50GB must stay at GH₵ 204");
assert.equal(priceFor("100GB"), 408, "100GB must stay at GH₵ 408");

// Other markets still scale from their own base price.
const ng = COUNTRIES.find((c) => c.code === "NG");
assert.ok(ng, "Nigeria must be in the catalogue");
assert.equal(bundlesFor(ng, 0)[0]?.price, 800, "Nigeria 1GB must stay at ₦ 800");
assert.equal(bundlesFor(ng, 0)[3]?.price, 6250, "Nigeria 10GB must stay at ₦ 6,250");

console.log("price catalogue checks passed");
