import { load, save } from "./storage";
import { todayKey } from "./dailySeed";

export interface Profile {
  name: string;
  streak: number;
  lastPlayed: string; // YYYY-MM-DD
  best: Record<string, number>;
}

const KEY = "custodial-hub-profile";
const empty: Profile = { name: "", streak: 0, lastPlayed: "", best: {} };

export const getProfile = (): Profile => ({ ...empty, ...load<Partial<Profile>>(KEY, {}) });
export const setName = (name: string) => save(KEY, { ...getProfile(), name });

function dayDiff(a: string, b: string): number {
  return Math.round((Date.parse(b) - Date.parse(a)) / 86400000);
}

// Call after finishing a game: updates daily streak and personal best.
export function recordPlay(game: string, score: number): Profile {
  const p = getProfile();
  const today = todayKey();
  if (p.lastPlayed !== today) {
    p.streak = p.lastPlayed && dayDiff(p.lastPlayed, today) === 1 ? p.streak + 1 : 1;
    p.lastPlayed = today;
  }
  p.best[game] = Math.max(p.best[game] ?? 0, score);
  save(KEY, p);
  return p;
}
