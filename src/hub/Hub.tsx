import { Flame, Trophy } from "lucide-react";
import { GAMES } from "../games";
import { getProfile } from "../lib/profile";
import { tipOfTheDay } from "../lib/tips";
import { todayKey } from "../lib/dailySeed";

export default function Hub({ onPlay, onBoard }: { onPlay: (id: string) => void; onBoard: (id: string) => void }) {
  const p = getProfile();
  const playedToday = p.lastPlayed === todayKey();
  return (
    <div className="mx-auto flex h-full max-w-md flex-col gap-4 overflow-y-auto p-4">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-[var(--brand-dark)]">Custodial Hub</h1>
        <div className="flex items-center gap-1 rounded-full bg-white px-3 py-1 font-extrabold shadow"
             title="Days in a row you've played">
          <Flame className={playedToday ? "text-orange-500" : "text-slate-300"} size={20} />
          {p.streak}
        </div>
      </header>

      <section className="rounded-2xl bg-white p-4 shadow">
        <p className="text-xs font-bold uppercase text-[var(--brand-dark)]">Tip of the day</p>
        <p className="mt-1 font-medium">{tipOfTheDay()}</p>
      </section>

      <h2 className="text-lg font-extrabold">Daily games</h2>
      {GAMES.map((g) => (
        <div key={g.id} className="flex overflow-hidden rounded-3xl bg-white shadow">
          <button onClick={() => onPlay(g.id)} className="flex flex-1 items-center gap-4 p-4 text-left active:opacity-80">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl text-4xl" style={{ background: g.color }}>
              {g.emoji}
            </span>
            <span>
              <span className="block text-xl font-extrabold">{g.title}</span>
              <span className="block text-sm text-slate-600">{g.blurb}</span>
              {p.best[g.id] != null && <span className="text-xs font-bold text-[var(--brand-dark)]">Best: {p.best[g.id].toLocaleString()}</span>}
            </span>
          </button>
          <button aria-label={`${g.title} leaderboard`} onClick={() => onBoard(g.id)}
                  className="flex w-16 items-center justify-center bg-[var(--accent)] active:opacity-80">
            <Trophy />
          </button>
        </div>
      ))}
    </div>
  );
}
