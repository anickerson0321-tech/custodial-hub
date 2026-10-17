import { describe, expect, it } from "vitest";
import { checkName } from "../src/lib/nameFilter";
import { dailyRng, makeRng, seedFromKey } from "../src/lib/dailySeed";

describe("checkName", () => {
  it.each(["Maria", "Big Mop 42", "J.R.", "Sam-the-Sweeper", "Scunthorpe"])("accepts %s", (n) => {
    expect(checkName(n).ok).toBe(true);
  });
  it.each(["fuck", "f u c k", "f.u.c.k", "sh1t", "FUCK you", "a$$hole", "n4zi"])("rejects %s", (n) => {
    expect(checkName(n).ok).toBe(false);
  });
  it("enforces length and characters", () => {
    expect(checkName("a").ok).toBe(false);
    expect(checkName("x".repeat(17)).ok).toBe(false);
    expect(checkName("<script>").ok).toBe(false);
  });
  it("trims and collapses spaces", () => {
    expect(checkName("  Big   Mop ")).toEqual({ ok: true, name: "Big Mop" });
  });
});

describe("daily seed", () => {
  it("is deterministic", () => {
    const a = makeRng(seedFromKey("2026-10-17"));
    const b = makeRng(seedFromKey("2026-10-17"));
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
    expect(dailyRng("x")()).toBe(dailyRng("x")());
  });
});
