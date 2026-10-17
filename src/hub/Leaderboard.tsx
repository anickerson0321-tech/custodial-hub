import { useEffect, useState } from "react";
import { fetchBoard, type Entry, type Period } from "../lib/leaderboardApi";

const TABS: { id: Period; label: string }[] = [
  { id: "daily", label: "Today" },
  { id: "weekly", label: "This week" },
  { id: "all", label: "All time" },
];

export default function Leaderboard({ game, me }: { game: string; me: string }) {
  const [period, setPeriod] = useState<Period>("daily");
  const [rows, setRows] = useState<Entry[] | null>(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    let live = true;
    setRows(null);
    setErr(false);
    fetchBoard(game, period)
      .then((r) => live && setRows(r))
      .catch(() => live && setErr(true));
    return () => { live = false; };
  }, [game, period]);

  return (
    <div className="w-full">
      <div className="mb-3 flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setPeriod(t.id)}
            className={`flex-1 rounded-xl px-2 py-2 text-sm font-bold ${
              period === t.id ? "bg-[var(--brand)] text-white" : "bg-white text-[var(--brand-dark)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <ol className="space-y-2">
        {err && <li className="text-center text-sm">Leaderboard unavailable right now.</li>}
        {!err && rows === null && <li className="text-center text-sm">Loading…</li>}
        {rows?.length === 0 && <li className="text-center text-sm">No scores yet. Be the first!</li>}
        {rows?.map((e, i) => (
          <li
            key={e.name}
            className={`flex items-center gap-3 rounded-xl px-3 py-2 ${
              e.name.toLowerCase() === me.toLowerCase() ? "bg-[var(--accent)]" : "bg-white"
            }`}
          >
            <span className="w-8 text-center text-lg font-extrabold">{["🥇", "🥈", "🥉"][i] ?? i + 1}</span>
            <span className="flex-1 truncate font-semibold">{e.name}</span>
            <span className="font-extrabold">{e.score.toLocaleString()}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
