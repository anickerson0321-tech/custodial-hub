# Custodial Hub

A phone-friendly hub with a daily games section: three custodial-themed games and leaderboards.

## Games
- **Closet Sort** (puzzle) - coming next
- **Spill Match** (puzzle) - coming next
- **Rush Hour Clean** (Diner Dash style) - coming next

## Run
```
npm install
npm run dev      # app + API on http://localhost:3000
npm run lint     # typecheck
npm test         # name filter + daily seed tests
npm run build && npm start   # production
```
Env: `PORT` (default 3000), `DB_FILE` (default `scores.db`).

## Phones
It's a PWA: "Add to Home Screen" opens it fullscreen on iOS and Android.

## Leaderboards
Players type a name; the server (`server/api.ts`) filters bad words with `obscenity` plus a custom list
in `src/lib/nameFilter.ts`. Scores are rate-limited and capped per game (`server/db.ts`). There is no login, so
names can be spoofed; add employee ID/SSO later if that matters.

## Branding
Colors live in `src/theme.css`; the logo/icon is `public/icon.svg`.
