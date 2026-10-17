export type Period = "daily" | "weekly" | "all";
export interface Entry { name: string; score: number }

export async function fetchBoard(game: string, period: Period): Promise<Entry[]> {
  const res = await fetch(`/api/leaderboard?game=${game}&period=${period}`);
  if (!res.ok) throw new Error("Could not load leaderboard");
  return (await res.json()).entries;
}

export async function submitScore(
  game: string,
  name: string,
  score: number,
): Promise<{ ok: true; name: string } | { ok: false; error: string }> {
  try {
    const res = await fetch("/api/scores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ game, name, score }),
    });
    return await res.json();
  } catch {
    return { ok: false, error: "Can't reach the leaderboard right now." };
  }
}
