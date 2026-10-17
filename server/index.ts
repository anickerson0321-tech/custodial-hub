import express from "express";
import path from "node:path";
import { openDb } from "./db";
import { apiRouter } from "./api";

const PORT = Number(process.env.PORT ?? 3000);
const isProd = process.env.NODE_ENV === "production";

async function main() {
  const app = express();
  app.set("trust proxy", 1);
  app.use("/api", apiRouter(openDb()));

  if (isProd) {
    const dist = path.resolve("dist");
    app.use(express.static(dist));
    app.get("*", (_req, res) => res.sendFile(path.join(dist, "index.html")));
  } else {
    const { createServer } = await import("vite");
    const vite = await createServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => console.log(`Custodial Hub on http://localhost:${PORT}`));
}
main();
