import { useState } from "react";
import { GAMES } from "./games";
import Hub from "./hub/Hub";
import Leaderboard from "./hub/Leaderboard";
import ScoreScreen from "./hub/ScoreScreen";
import { getProfile, recordPlay } from "./lib/profile";

type View =
  | { name: "hub" }
  | { name: "play"; id: string; round: number }
  | { name: "score"; id: string; score: number }
  | { name: "board"; id: string };

export default function App() {
  const [view, setView] = useState<View>({ name: "hub" });
  const game = "id" in view ? GAMES.find((g) => g.id === view.id) : undefined;
  const home = () => setView({ name: "hub" });

  let screen;
  if (view.name === "play" && game) {
    const Game = game.component;
    screen = (
      <Game
        key={view.round}
        onExit={home}
        onFinish={(score) => {
          recordPlay(game.id, score);
          setView({ name: "score", id: game.id, score });
        }}
      />
    );
  } else if (view.name === "score" && game) {
    screen = (
      <ScoreScreen game={game.id} title={game.title} score={view.score}
        onAgain={() => setView({ name: "play", id: game.id, round: Date.now() })} onHome={home} />
    );
  } else if (view.name === "board" && game) {
    screen = (
      <div className="mx-auto flex h-full max-w-md flex-col gap-4 overflow-y-auto p-4">
        <h1 className="text-2xl font-extrabold text-[var(--brand-dark)]">{game.title} leaderboard</h1>
        <Leaderboard game={game.id} me={getProfile().name} />
        <button onClick={home} className="rounded-2xl bg-white py-3 font-extrabold text-[var(--brand-dark)]">Back</button>
      </div>
    );
  } else {
    screen = (
      <Hub
        onPlay={(id) => setView({ name: "play", id, round: Date.now() })}
        onBoard={(id) => setView({ name: "board", id })}
      />
    );
  }
  return <div className="h-full">{screen}</div>;
}
