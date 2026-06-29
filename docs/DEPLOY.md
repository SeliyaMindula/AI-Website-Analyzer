# Deploy WebPulse AI (100% free hosting)

Step-by-step guide using **Vercel** (frontend, free) + **Render** (backend, free).

**Total hosting cost: $0/month** — you only pay for your domain (`webpulsesai.com`).

---

## Free tier trade-offs

| Platform | Free limit | What it means for you |
|----------|------------|------------------------|
| **Vercel** | Hobby free | Frontend is always fast — good for production |
| **Render** | Free web service | API **sleeps after 15 min** with no traffic; first request after sleep takes **~1 min** to wake up |
| **Render** | 750 hours/month | Plenty for a portfolio site with normal traffic |

For a portfolio/demo site this is fine. If the API feels slow on first use, wait ~60 seconds and try again — it wakes up.

---

## Overview

| Part | Platform | Cost | URL |
|------|----------|------|-----|
| Frontend | Vercel | Free | `https://www.webpulsesai.com` |
| Backend API | Render | Free | `https://api.webpulsesai.com` |
| Code | GitHub | Free | `SeliyaMindula/AI-Website-Analyzer` |

---

## Step 1 — Push code to GitHub

From the project root:

```bash
git add .
git commit -m "chore: add free deployment config (Vercel + Render)"
git push origin main
```

Use `master` if that is your default branch.

---

## Step 2 — Deploy the backend (Render, free)

1. Go to [render.com](https://render.com) and sign up with **GitHub** (no credit card needed for free tier).
2. **New +** → **Blueprint** → connect repo `AI-Website-Analyzer`.
3. Render detects `render.yaml` at the repo root — review the **webpulse-api** service.
4. Set environment variables when prompted:

   | Variable | Value |
   |----------|-------|
   | `CORS_ORIGIN` | `https://www.webpulsesai.com,https://webpulsesai.com` |
   | `GOOGLE_PSI_API_KEY` | your Google PSI key |

5. Click **Apply** and wait for the deploy (first build ~3–5 min).
6. Open the service → **Settings → Custom Domains** → add **`api.webpulsesai.com`**.
7. Render shows a **CNAME** target — save it for Step 4.

**Manual setup** (if Blueprint is skipped):

- **New +** → **Web Service** → connect repo
- **Root Directory:** `backend`
- **Runtime:** Node
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm run start:prod`
- **Instance Type:** **Free**
- **Health Check Path:** `/health`
- Same env vars as above

**Verify:** open `https://<your-render-url>.onrender.com/health`:

```json
{ "status": "ok", "service": "webpulse-api" }
```

---

## Step 3 — Deploy the frontend (Vercel, free)

1. Go to [vercel.com](https://vercel.com) and sign up with **GitHub**.
2. **Add New → Project** → import `AI-Website-Analyzer`.
3. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend`
4. **Environment Variables:**

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_API_URL` | `https://api.webpulsesai.com` |
   | `NEXT_PUBLIC_SITE_URL` | `https://www.webpulsesai.com` |

5. Click **Deploy**.
6. **Settings → Domains** → add **`www.webpulsesai.com`** and **`webpulsesai.com`**.

**Verify:** Vercel preview URL shows the tools hub.

---

## Step 4 — DNS at your domain registrar

### Frontend (Vercel)

| Type | Name | Value |
|------|------|-------|
| CNAME | `www` | From Vercel dashboard (often `cname.vercel-dns.com`) |

For apex `webpulsesai.com`, follow Vercel’s instructions (A record or redirect to `www`).

### Backend (Render)

| Type | Name | Value |
|------|------|-------|
| CNAME | `api` | Render custom-domain target (from Step 2) |

DNS propagation: **5–60 minutes**.

---

## Step 5 — Final checks

| Check | Expected |
|-------|----------|
| `https://www.webpulsesai.com` | Tools hub loads |
| `https://api.webpulsesai.com/health` | `{ "status": "ok" }` |
| `/dns`, `/ssl`, `/ip` | Return results (may be slow first time if API was asleep) |
| `/analyze` | Works if `GOOGLE_PSI_API_KEY` is set |

---

## Redeploying updates

Push to GitHub — Vercel and Render auto-deploy:

```bash
git push origin main
```

---

## Troubleshooting

**First API request is very slow (~1 minute)**  
Normal on Render free tier — the service was asleep. Subsequent requests are fast until 15 min idle.

**CORS error in browser**  
Set `CORS_ORIGIN=https://www.webpulsesai.com,https://webpulsesai.com` on Render and redeploy.

**Frontend works, tools fail**  
- Check `NEXT_PUBLIC_API_URL` on Vercel  
- Redeploy Vercel after env changes  
- Hit `https://api.webpulsesai.com/health` directly first to wake the API

**PageSpeed “API key not configured”**  
Add `GOOGLE_PSI_API_KEY` on Render.

**Render suspended my service**  
Free tier has 750 instance hours/month — rare for a portfolio site. Resets on the 1st of each month.

---

## Paid upgrade (optional later)

If you outgrow free tier:

| Need | Upgrade |
|------|---------|
| API always on, no cold starts | Render Starter ~$7/mo |
| More traffic / team features | Vercel Pro |

See also `backend/railway.toml` if you prefer Railway (~$5/mo).
