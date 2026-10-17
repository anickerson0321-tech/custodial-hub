export const TIPS = [
  "Always wear gloves when handling chemicals, and never mix bleach with ammonia.",
  "Put out a wet floor sign before you mop, not after.",
  "Lift with your legs, not your back, when moving heavy trash bags.",
  "Read the label: dilution ratios matter for safety and for your budget.",
  "Work top to bottom and back to front so dirt never falls on cleaned areas.",
  "Change mop water often. Dirty water just spreads dirt around.",
  "Color-code cloths (restroom vs. break room) to prevent cross-contamination.",
  "Disinfectants need dwell time. Let them sit for the time on the label.",
  "Report spills and leaks right away. Fast reports prevent slips.",
  "Store chemicals in their original labeled containers, never in drink bottles.",
];
import { seedFromKey, todayKey } from "./dailySeed";
export const tipOfTheDay = () => TIPS[seedFromKey(todayKey()) % TIPS.length];
