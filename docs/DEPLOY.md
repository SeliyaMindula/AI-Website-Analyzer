# Deploy WebPulse AI (100% free hosting)

Step-by-step guide using **Vercel** (frontend, free) + a free backend host.

**Total hosting cost: $0/month** — you only pay for your domain (`webpulsesai.com`).

---

## Render or Koyeb asked for a credit card?

Both platforms do this for **anti-abuse / identity checks**. It does **not** always mean you will be charged monthly.

| Platform | If you add a card | If you skip |
|----------|-------------------|-------------|
| **Render** | ~$1 hold (often refunded). Stay on **Free** instance → **$0/mo** | Try **Web Service** (not Blueprint), or use **Belmo** below |
| **Koyeb** | May verify with ~$1 hold. **Free instance** → Koyeb says **no charge** for the `free` web service | Try **Belmo** or **Bonto** below |

**If you do not want to add a card anywhere:** use **Belmo** for the backend (Step 2A).

---

## Free tier trade-offs

| Platform | Card needed? | Trade-off |
|----------|--------------|-----------|
| **Vercel** | No | Frontend always fast |
| **Belmo** | **No** (advertised) | API **always on**, 1 free service |
| **Bonto** | **No** (advertised) | 75 hrs/month, may sleep when idle |
| **Koyeb / Render** | Often yes | Free tier available after verification |

---

## Overview

| Part | Platform | Cost | URL |
|------|----------|------|-----|
| Frontend | Vercel | Free | `https://www.webpulsesai.com` |
| Backend API | **Belmo** (no card) or Render/Koyeb | Free | `https://api.webpulsesai.com` |
| Code | GitHub | Free | `SeliyaMindula/AI-Website-Analyzer` |

---

## Step 1 — Push code to GitHub

From the project root:

```bash
git add .
git commit -m "chore: add free deployment config"
git push origin main
```

Use `master` if that is your default branch.

---

## Step 2A — Backend on Belmo (no credit card) ⭐ try this first

1. Go to [belmo.io](https://belmo.io) → sign up with **GitHub** (they advertise **no credit card**).
2. Install the Belmo GitHub app → select repo `AI-Website-Analyzer`.
3. Create a **Web Service**:
   - **Root directory / working directory:** `backend`
   - Belmo auto-detects Node.js from `backend/package.json`
   - **Start command:** `npm run start:prod` (after build)
4. **Instance:** Starter (free — always on, no sleep)
5. **Environment variables:**

   | Variable | Value |
   |----------|-------|
   | `CORS_ORIGIN` | `https://www.webpulsesai.com,https://webpulsesai.com` |
   | `GOOGLE_PSI_API_KEY` | your Google PSI key |
   | `SUMMARY_PROVIDER` | `rule-based` |

6. Deploy → copy your `.belmo.io` URL (or similar).
7. **Custom domain:** add **`api.webpulsesai.com`** → add CNAME at your registrar.

**Verify:** `https://<your-app>/health` → `{ "status": "ok" }`

---

## Step 2B — Backend on Koyeb (card may be required in some regions)

1. Go to [koyeb.com](https://www.koyeb.com) → sign up with GitHub.
2. If payment info is **not** required: **Create App** → GitHub → `AI-Website-Analyzer`.
3. **Build:** `cd backend && npm install && npm run build`
4. **Run:** `cd backend && npm run start:prod`
5. **Instance type:** `free` (512 MB RAM)
6. Same env vars as Belmo (Step 2A).
7. Custom domain: **`api.webpulsesai.com`**

If Koyeb asks for payment info and you do not want to add a card, use **Belmo** (Step 2A) instead.

---

## Step 2C — Backend on Render (card often required)

**Skip Blueprint** — use **New + → Web Service**:

1. Go to [render.com](https://render.com) and sign in with **GitHub**.
2. **New +** → **Web Service** → connect repo `AI-Website-Analyzer`.
3. Configure:
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start:prod`
   - **Instance Type:** **Free**
   - **Health Check Path:** `/health`
4. Environment variables:

   | Variable | Value |
   |----------|-------|
   | `CORS_ORIGIN` | `https://www.webpulsesai.com,https://webpulsesai.com` |
   | `GOOGLE_PSI_API_KEY` | your Google PSI key |
   | `SUMMARY_PROVIDER` | `rule-based` |

5. Deploy → **Settings → Custom Domains** → add **`api.webpulsesai.com`**.

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

### Backend (Koyeb or Render)

| Type | Name | Value |
|------|------|-------|
| CNAME | `api` | Target from Koyeb or Render custom-domain settings |

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

Push to GitHub — Vercel and your backend host auto-deploy:

```bash
git push origin main
```

---

## Troubleshooting

**First API request is very slow (~1 minute)**  
Normal on Render free tier — the service was asleep. Subsequent requests are fast until 15 min idle.

**CORS error in browser**  
Set `CORS_ORIGIN=https://www.webpulsesai.com,https://webpulsesai.com` on the backend and redeploy.

**Frontend works, tools fail**  
- Check `NEXT_PUBLIC_API_URL` on Vercel  
- Redeploy Vercel after env changes  
- Hit `https://api.webpulsesai.com/health` directly first to wake the API

**PageSpeed “API key not configured”**  
Add `GOOGLE_PSI_API_KEY` on Koyeb or Render.

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
