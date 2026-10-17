import { useState } from "react";
import { checkName } from "../lib/nameFilter";
import { submitScore } from "../lib/leaderboardApi";
import { getProfile, setName } from "../lib/profile";
import Leaderboard from "./Leaderboard";

export default function ScoreScreen({
  game, title, score, onAgain, onHome,
}: { game: string; title: string; score: number; onAgain: () => void; onHome: () => void }) {
  const [name, setNameState] = useState(getProfile().name);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit() {
    const local = checkName(name);
    if (!local.ok) return setError(local.error);
    setBusy(true);
    const res = await submitScore(game, local.name, score);
    setBusy(false);
    if (!res.ok) return setError(res.error);
    setName(res.name);
    setNameState(res.name);
    setError("");
    setSaved(true);
  }

  return (
    <div className="mx-auto flex h-full max-w-md flex-col gap-4 overflow-y-auto p-4">
      <div className="rounded-3xl bg-white p-5 text-center shadow">
        <p className="text-sm font-bold uppercase text-[var(--brand-dark)]">{title}</p>
        <p className="text-5xl font-extrabold">{score.toLocaleString()}</p>
        {!saved ? (
          <div className="mt-4 space-y-2">
            <input
              value={name}
              onChange={(e) => setNameState(e.target.value)}
              maxLength={16}
              placeholder="Your name for the leaderboard"
              className="w-full rounded-xl border-2 border-sky-200 px-3 py-3 text-center text-lg"
              style={{ userSelect: "text" }}
            />
            {error && <p className="text-sm font-semibold text-[var(--bad)]">{error}</p>}
            <button disabled={busy} onClick={submit}
              className="w-full rounded-2xl bg-[var(--good)] py-3 text-lg font-extrabold text-white disabled:opacity-60">
              {busy ? "Saving…" : "Post my score"}
            </button>
          </div>
        ) : (
          <p className="mt-3 font-bold text-[var(--good)]">Score posted!</p>
        )}
      </div>
      <Leaderboard key={String(saved)} game={game} me={name} />
      <div className="flex gap-3 pb-4">
        <button onClick={onAgain} className="flex-1 rounded-2xl bg-[var(--brand)] py-3 font-extrabold text-white">Play again</button>
        <button onClick={onHome} className="flex-1 rounded-2xl bg-white py-3 font-extrabold text-[var(--brand-dark)]">Home</button>
      </div>
    </div>
  );
}
