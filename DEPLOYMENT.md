# Deployment Guide — Anti-Drift OS on Vercel

## Prerequisites

- [Vercel](https://vercel.com) account
- Git repository connected to Vercel

No database or backend env vars are required. All user data is stored in the browser (IndexedDB).

## 1. Environment Variables (optional)

In Vercel → Project → Settings → Environment Variables:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_APP_URL` | Production URL (e.g. `https://antidrift.vercel.app`) |

## 2. Deploy

```bash
git push origin main
```

Vercel auto-deploys on push. Build command: `next build --webpack` (configured in `package.json`).

## 3. Verify PWA

1. Open the deployed URL on mobile Chrome or Safari.
2. **Android:** Menu → "Install app" or "Add to Home screen"
3. **iOS Safari:** Share → "Add to Home Screen"
4. Confirm app icon and splash screen appear.
5. Test offline: open app, toggle airplane mode, complete a check-in — data persists locally.

## 4. Weekly CEO Review

The current week's review is auto-created when the app opens (client-side). No server cron is needed.

## 5. Post-Deploy Checklist

- [ ] Dashboard loads with identity statement
- [ ] Daily check-in autosaves
- [ ] Emergency Mode FAB visible on all pages
- [ ] `/emergency` wizard completes and logs session
- [ ] CEO Review scoreboard renders
- [ ] Export JSON/Markdown from Settings works
- [ ] Service worker registered (`/sw.js` returns 200)

## Troubleshooting

### 404 — "The page could not be found" (Vercel NOT_FOUND)

This is a **Vercel platform** error, not your Next.js app. The build succeeded but the domain is not linked to a deployment.

1. Open [Vercel Dashboard](https://vercel.com/dashboard) → your **antidrift** project
2. Go to **Settings → Domains**
3. Add `antidrift.vercel.app` (or your custom domain) and assign it to **Production**
4. Go to **Deployments** → find the latest successful deployment → **⋯** → **Promote to Production**
5. Redeploy if needed: **Deployments** → **Redeploy**

### 401 — Deployment Protection / SSO

If deployment URLs return **401 Authentication Required**:

1. **Settings → Deployment Protection**
2. Set **Production** to **None** (or "Only Preview Deployments" protected)
3. Save and revisit the URL

### PWA not installing

Ensure `npm run build` uses `--webpack`. Turbopack builds skip service worker generation.

### Data missing after reinstall

Data is per-browser/per-device. Export JSON from Settings before clearing site data or reinstalling the PWA.

## Security Notes

This app has no authentication. Deploy to a private URL or protect with Vercel Password Protection if needed. User data never leaves the device unless exported manually.
