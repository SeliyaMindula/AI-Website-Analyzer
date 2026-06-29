# Deploy WebPulse AI to www.webpulsesai.com

Step-by-step guide using **Vercel** (frontend) + **Railway** (backend).

---

## Overview

| Part | Platform | URL |
|------|----------|-----|
| Frontend | Vercel | `https://www.webpulsesai.com` |
| Backend API | Railway | `https://api.webpulsesai.com` |
| Code | GitHub | `SeliyaMindula/AI-Website-Analyzer` |

---

## Step 1 — Push latest code to GitHub

From the project root:

```bash
git add .
git commit -m "chore: add deployment config for webpulsesai.com"
git push origin main
```

If your default branch is `master`, use that instead.

---

## Step 2 — Deploy the backend (Railway)

1. Go to [railway.app](https://railway.app) and sign in with GitHub.
2. **New Project** → **Deploy from GitHub repo** → select `AI-Website-Analyzer`.
3. Railway may create a service at repo root. Open **Settings**:
   - **Root Directory:** `backend`
   - **Builder:** Dockerfile (auto-detected via `backend/railway.toml`)
4. Open **Variables** and add:

   | Variable | Value |
   |----------|-------|
   | `CORS_ORIGIN` | `https://www.webpulsesai.com,https://webpulsesai.com` |
   | `GOOGLE_PSI_API_KEY` | your Google PSI key |
   | `SUMMARY_PROVIDER` | `rule-based` |

   Railway sets `PORT` automatically — do not hardcode it.

5. **Settings → Networking → Generate Domain** — note the URL (e.g. `webpulse-api-production.up.railway.app`).
6. **Settings → Custom Domain** → add `api.webpulsesai.com`.
7. Railway shows a **CNAME** target — copy it for DNS (Step 4).

**Verify:** open `https://<railway-domain>/health` — you should see:

```json
{ "status": "ok", "service": "webpulse-api" }
```

---

## Step 3 — Deploy the frontend (Vercel)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. **Add New → Project** → import `AI-Website-Analyzer`.
3. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend` (click Edit)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)
4. **Environment Variables:**

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_API_URL` | `https://api.webpulsesai.com` |
   | `NEXT_PUBLIC_SITE_URL` | `https://www.webpulsesai.com` |

5. Click **Deploy** and wait for the build to finish.
6. **Project → Settings → Domains**:
   - Add `www.webpulsesai.com`
   - Add `webpulsesai.com` (Vercel can redirect apex → www)
7. Vercel shows DNS records — copy them for Step 4.

**Verify:** open the Vercel preview URL — tools hub should load. DNS may take a few minutes after Step 4.

---

## Step 4 — DNS at your domain registrar

Where you bought `webpulsesai.com`, open DNS settings and add:

### Frontend (Vercel)

| Type | Name | Value |
|------|------|-------|
| CNAME | `www` | `cname.vercel-dns.com` (or value from Vercel dashboard) |

For apex (`webpulsesai.com`), use what Vercel recommends — often an **A record** to `76.76.21.21` or their ALIAS/ANAME option.

### Backend (Railway)

| Type | Name | Value |
|------|------|-------|
| CNAME | `api` | Railway custom-domain target (from Step 2) |

DNS can take **5–60 minutes** to propagate.

---

## Step 5 — Final checks

After DNS propagates:

| Check | Expected |
|-------|----------|
| `https://www.webpulsesai.com` | Tools hub loads |
| `https://api.webpulsesai.com/health` | `{ "status": "ok" }` |
| DNS lookup on `/dns` | Returns records |
| IP lookup on `/ip` | Returns geolocation |
| Analyze on `/analyze` | Works if `GOOGLE_PSI_API_KEY` is set |

If the frontend loads but tools fail with network errors:

- Confirm `NEXT_PUBLIC_API_URL` on Vercel is `https://api.webpulsesai.com`
- Redeploy Vercel after changing env vars
- Confirm `CORS_ORIGIN` on Railway includes `https://www.webpulsesai.com`

---

## Redeploying updates

Push to GitHub — Vercel and Railway redeploy automatically if connected.

```bash
git push origin main
```

---

## Optional — Render instead of Railway

1. [render.com](https://render.com) → **New Web Service** → connect repo.
2. **Root Directory:** `backend`
3. **Build:** `npm install && npm run build`
4. **Start:** `npm run start:prod`
5. **Health Check Path:** `/health`
6. Add the same env vars as Railway.
7. Custom domain: `api.webpulsesai.com`

---

## Costs (typical)

- **Vercel:** free tier for personal/hobby projects
- **Railway:** free trial credits, then ~$5/mo for small API
- **Domain:** already purchased

---

## Troubleshooting

**CORS error in browser console**  
Set `CORS_ORIGIN=https://www.webpulsesai.com,https://webpulsesai.com` on the backend and redeploy.

**PageSpeed shows “API key not configured”**  
Add `GOOGLE_PSI_API_KEY` on Railway and redeploy.

**Speed test upload fails**  
Backend must accept raw body up to 6MB — already configured in `main.ts`; ensure you are not behind a proxy with a lower limit.

**SSL certificate pending on Vercel/Railway**  
Wait for DNS to propagate; both platforms issue certs automatically once DNS is correct.
