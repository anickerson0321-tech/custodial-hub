import type { ComponentType } from "react";

export interface GameProps {
  /** Call when a round ends with the final score. The hub handles the score screen + leaderboard. */
  onFinish: (score: number) => void;
  onExit: () => void;
}

export interface GameInfo {
  id: "closet-sort" | "spill-match" | "rush-hour";
  title: string;
  blurb: string;
  emoji: string;
  color: string;
  component: ComponentType<GameProps>;
}
