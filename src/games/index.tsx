import type { GameInfo, GameProps } from "./registry";

function ComingSoon({ onExit }: GameProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="text-2xl font-bold">Coming soon!</p>
      <button className="rounded-2xl bg-[var(--brand)] px-6 py-3 font-bold text-white" onClick={onExit}>
        Back
      </button>
    </div>
  );
}

export const GAMES: GameInfo[] = [
  { id: "closet-sort", title: "Closet Sort", emoji: "🧴", color: "#f97316",
    blurb: "Pour and sort the supply closet", component: ComingSoon },
  { id: "spill-match", title: "Spill Match", emoji: "🧽", color: "#a855f7",
    blurb: "Match supplies and wipe up spills", component: ComingSoon },
  { id: "rush-hour", title: "Rush Hour Clean", emoji: "🧹", color: "#10b981",
    blurb: "Keep every room spotless, fast", component: ComingSoon },
];
