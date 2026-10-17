import { RegExpMatcher, englishDataset, englishRecommendedTransformers } from "obscenity";

// Shared by the browser (instant feedback) and the server (authoritative check).
const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});

// Extra terms to block for a workplace setting. Add more here.
const CUSTOM_BLOCKED = ["hitler", "nazi", "kkk", "rapist", "boss sucks"];

export const NAME_MIN = 2;
export const NAME_MAX = 16;

export type NameCheck = { ok: true; name: string } | { ok: false; error: string };

export function checkName(raw: string): NameCheck {
  const name = (raw ?? "").normalize("NFKC").replace(/\s+/g, " ").trim();
  if (name.length < NAME_MIN) return { ok: false, error: `Name must be at least ${NAME_MIN} characters.` };
  if (name.length > NAME_MAX) return { ok: false, error: `Name must be ${NAME_MAX} characters or fewer.` };
  if (!/^[\p{L}\p{N} ._'-]+$/u.test(name))
    return { ok: false, error: "Use letters, numbers, spaces, and . _ ' - only." };

  // Check as typed, and with separators removed so "f u c k" or "f.u.c.k" can't sneak through.
  const squashed = name.replace(/[\s._'-]+/g, "");
  const lower = squashed
    .toLowerCase()
    .replace(/[@4]/g, "a").replace(/[3]/g, "e").replace(/[1!|]/g, "i")
    .replace(/[0]/g, "o").replace(/[$5]/g, "s").replace(/[7]/g, "t");
  if (
    matcher.hasMatch(name) ||
    matcher.hasMatch(squashed) ||
    CUSTOM_BLOCKED.some((w) => lower.includes(w.replace(/\s+/g, "")))
  ) {
    return { ok: false, error: "Please pick a friendlier name." };
  }
  return { ok: true, name };
}
