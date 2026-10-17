import express from "express";
import rateLimit from "express-rate-limit";
import { checkName } from "../src/lib/nameFilter";
import { addScore, topScores, GAMES, MAX_SCORE, type Db, type Game, type Period } from "./db";

const isGame = (g: unknown): g is Game => GAMES.includes(g as Game);
const PERIODS: Period[] = ["daily", "weekly", "all"];

export function apiRouter(db: Db) {
  const r = express.Router();
  r.use(express.json({ limit: "2kb" }));

  r.get("/health", (_req, res) => res.json({ status: "ok" }));

  r.post("/check-name", (req, res) => {
    const result = checkName(String(req.body?.name ?? ""));
    res.status(result.ok ? 200 : 400).json(result);
  });

  r.post("/scores", rateLimit({ windowMs: 60_000, limit: 20, standardHeaders: true, legacyHeaders: false }), (req, res) => {
    const { game, name, score } = req.body ?? {};
    if (!isGame(game)) return res.status(400).json({ ok: false, error: "Unknown game." });
    const checked = checkName(String(name ?? ""));
    if (!checked.ok) return res.status(400).json(checked);
    if (!Number.isInteger(score) || score < 0 || score > MAX_SCORE[game])
      return res.status(400).json({ ok: false, error: "Invalid score." });
    addScore(db, game, checked.name, score);
    res.json({ ok: true, name: checked.name });
  });

  r.get("/leaderboard", (req, res) => {
    const { game, period = "daily" } = req.query;
    if (!isGame(game)) return res.status(400).json({ error: "Unknown game." });
    if (!PERIODS.includes(period as Period)) return res.status(400).json({ error: "Unknown period." });
    res.json({ game, period, entries: topScores(db, game, period as Period) });
  });

  return r;
}
