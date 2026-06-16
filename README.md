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
- Supabase (Postgres, no auth/RLS)
- TanStack Query + IndexedDB offline cache
- Zustand, React Hook Form, Zod, Framer Motion, Recharts
- next-pwa

## Getting Started

```bash
npm install
cp .env.example .env.local
# Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to `/dashboard`.

## Database Setup

Run the migration and seed in your Supabase project:

```bash
# Using Supabase CLI
supabase db push
psql $DATABASE_URL -f supabase/seed.sql
```

Or apply `supabase/migrations/001_initial_schema.sql` and `supabase/seed.sql` manually in the Supabase SQL editor.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build (webpack, for PWA) |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |

## Architecture

- Client → Next.js API routes (BFF) → Supabase service role
- No authentication — designed for single-user local deployment
- Offline: TanStack Query persist + mutation queue in IndexedDB
- Auth-ready stub at `src/lib/auth/index.ts`

## License

Private — single-user application.
# antidrift
