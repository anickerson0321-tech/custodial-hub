import Database from "better-sqlite3";

export const GAMES = ["closet-sort", "spill-match", "rush-hour"] as const;
export type Game = (typeof GAMES)[number];
export type Period = "daily" | "weekly" | "all";

// Upper bound per game, so obviously fake scores are rejected.
export const MAX_SCORE: Record<Game, number> = {
  "closet-sort": 10000,
  "spill-match": 100000,
  "rush-hour": 100000,
};

export function openDb(file = process.env.DB_FILE ?? "scores.db") {
  const db = new Database(file);
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      game TEXT NOT NULL,
      name TEXT NOT NULL,
      score INTEGER NOT NULL,
      created_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_scores_game_time ON scores (game, created_at);
  `);
  return db;
}

export type Db = ReturnType<typeof openDb>;

const startOfDay = (now: number) => {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

export function periodStart(period: Period, now = Date.now()): number {
  if (period === "daily") return startOfDay(now);
  if (period === "weekly") return startOfDay(now) - 6 * 86400000;
  return 0;
}

export function addScore(db: Db, game: Game, name: string, score: number, now = Date.now()) {
  db.prepare("INSERT INTO scores (game, name, score, created_at) VALUES (?, ?, ?, ?)").run(game, name, score, now);
}

// Best score per player (case-insensitive name) within the period.
export function topScores(db: Db, game: Game, period: Period, limit = 25, now = Date.now()) {
  return db
    .prepare(
      `SELECT name, MAX(score) AS score FROM scores
       WHERE game = ? AND created_at >= ?
       GROUP BY lower(name) ORDER BY score DESC, MIN(created_at) ASC LIMIT ?`,
    )
    .all(game, periodStart(period, now), limit) as { name: string; score: number }[];
}
