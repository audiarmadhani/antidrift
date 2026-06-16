# Deployment Guide — Anti-Drift OS on Vercel

## Prerequisites

- [Supabase](https://supabase.com) project
- [Vercel](https://vercel.com) account
- Git repository connected to Vercel

## 1. Supabase Setup

1. Create a new Supabase project.
2. Open **SQL Editor** and run:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/seed.sql`
3. Copy from **Project Settings → API**:
   - Project URL → `SUPABASE_URL`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

**Important:** Never expose the service role key to the client. It is only used in API routes.

## 2. Vercel Environment Variables

In Vercel → Project → Settings → Environment Variables:

| Variable | Value |
|----------|-------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role secret |
| `NEXT_PUBLIC_APP_URL` | Production URL (e.g. `https://antidrift.vercel.app`) |

## 3. Deploy

```bash
git push origin main
```

Vercel auto-deploys on push. Build command: `next build --webpack` (configured in `package.json`).

## 4. Verify PWA

1. Open the deployed URL on mobile Chrome or Safari.
2. **Android:** Menu → "Install app" or "Add to Home screen"
3. **iOS Safari:** Share → "Add to Home Screen"
4. Confirm app icon and splash screen appear.
5. Test offline: open app, toggle airplane mode, complete a check-in, reconnect — data should sync.

## 5. Weekly CEO Review Cron

`vercel.json` configures a cron job hitting `/api/reviews/ensure` every Sunday at 00:00 UTC. This auto-creates the current week's review.

## 6. Post-Deploy Checklist

- [ ] Dashboard loads with identity statement
- [ ] Daily check-in autosaves
- [ ] Emergency Mode FAB visible on all pages
- [ ] `/emergency` wizard completes and logs session
- [ ] CEO Review scoreboard renders
- [ ] Export JSON/Markdown from Settings works
- [ ] Service worker registered (`/sw.js` returns 200)

## Troubleshooting

**503 Database not configured**
→ Verify env vars are set in Vercel and redeploy.

**PWA not installing**
→ Ensure `npm run build` uses `--webpack`. Turbopack builds skip service worker generation.

**Offline sync not working**
→ Check browser DevTools → Application → IndexedDB for `antidrift-query-cache`.

## Security Notes

This app has no authentication. Deploy to a private URL or protect with Vercel Password Protection if needed. The service role key bypasses RLS — keep it server-side only.
