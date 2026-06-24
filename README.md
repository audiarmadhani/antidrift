# Anti-Drift OS

A single-user Progressive Web App — a life operating system to prevent drift and align daily actions with long-term identity.

## Features

- **Dashboard** — Drift score, daily check-in, stats, analytics charts
- **Emergency Mode** — 5-step urge interrupt flow with 10-minute friction timer
- **Journal** — Daily postmortem with systems-focused prompts
- **Goals** — Six life domains with progress tracking
- **Weekly CEO Review** — Scoreboard, reflection sections, CEO letter, archive exports
- **Relapse Log** — Clinical behavior tracking and analytics
- **Settings** — JSON/Markdown export, import, reset

## Tech Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 + shadcn/ui
- IndexedDB (idb-keyval) — all data stored on device
- TanStack Query + IndexedDB query cache
- Zustand, React Hook Form, Zod, Framer Motion, Recharts
- next-pwa

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to `/dashboard`.

On first launch, default goals and your identity manifesto are seeded locally in the browser.

## Backup & Restore

All data lives in IndexedDB on your device. Use **Settings → Export JSON** regularly to back up. Import restores from a previous export.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build (webpack, for PWA) |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |

## Architecture

- **Local-first** — client reads/writes IndexedDB directly; no server database
- No authentication — designed for single-user private use
- TanStack Query caches query results in IndexedDB for fast reloads
- Weekly CEO review auto-created on app open (client-side)

## License

Private — single-user application.
