# Deploy WebPulse AI — Render + Vercel

**Frontend:** Vercel (free) → `https://www.webpulsesai.com`  
**Backend:** Render (free) → `https://api.webpulsesai.com`  
**Cost:** $0/month on free tiers (domain is separate)

Render free tier: API **sleeps after 15 min** idle; first request after sleep may take **~1 minute**.

---

## Step 1 — Push code to GitHub

```bash
git add .
git commit -m "chore: prepare Render deployment"
git push origin main
```

---

## Step 2 — Backend on Render

### Option A — Blueprint (uses `render.yaml` in repo root)

1. [render.com](https://render.com) → sign in with GitHub
2. **New +** → **Blueprint** → connect `AI-Website-Analyzer`
3. Review **webpulse-api** service from `render.yaml`
4. Set secrets when prompted:

   | Variable | Value |
   |----------|-------|
   | `CORS_ORIGIN` | `https://www.webpulsesai.com,https://webpulsesai.com` |
   | `GOOGLE_PSI_API_KEY` | your Google PSI key |

5. **Apply** and wait for deploy (~3–5 min)

If Blueprint asks for a credit card, use **Option B** instead (or add card — Free tier stays $0).

### Option B — Web Service (manual, recommended)

1. **New +** → **Web Service** → connect `AI-Website-Analyzer`
2. Settings:

   | Field | Value |
   |-------|-------|
   | **Name** | `webpulse-api` |
   | **Root Directory** | `backend` |
   | **Runtime** | Node |
   | **Build Command** | `npm install --include=dev && npm run build` |
   | **Start Command** | `npm start` |
   | **Instance Type** | **Free** |
   | **Health Check Path** | `/health` |

3. **Environment variables:**

   | Variable | Value |
   |----------|-------|
   | `NODE_ENV` | `production` |
   | `CORS_ORIGIN` | `https://www.webpulsesai.com,https://webpulsesai.com` |
   | `GOOGLE_PSI_API_KEY` | your Google PSI key |
   | `SUMMARY_PROVIDER` | `rule-based` |

   Do **not** set `PORT` — Render injects it automatically.

4. **Create Web Service** → wait for deploy
5. **Settings → Custom Domains** → add **`api.webpulsesai.com`**
6. Add the **CNAME** at your domain registrar

**Verify:** `https://<your-service>.onrender.com/health`

```json
{ "status": "ok", "service": "webpulse-api" }
```

---

## Step 3 — Frontend on Vercel

1. [vercel.com](https://vercel.com) → import `AI-Website-Analyzer`
2. **Root Directory:** `frontend`
3. **Environment variables:**

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_API_URL` | `https://api.webpulsesai.com` |
   | `NEXT_PUBLIC_SITE_URL` | `https://www.webpulsesai.com` |

4. **Deploy**
5. **Settings → Domains** → `www.webpulsesai.com` and `webpulsesai.com`

Until DNS is ready, you can temporarily set `NEXT_PUBLIC_API_URL` to your `.onrender.com` URL.

---

## Step 4 — DNS

| Type | Name | Points to |
|------|------|-----------|
| CNAME | `www` | Vercel (from dashboard) |
| CNAME | `api` | Render (from dashboard) |
| A / redirect | `@` | Vercel apex or redirect to `www` |

---

## Step 5 — Final checks

| URL | Expected |
|-----|----------|
| `https://www.webpulsesai.com` | Tools hub |
| `https://api.webpulsesai.com/health` | `{ "status": "ok" }` |
| `/dns`, `/analyze` on site | Work (first API call may be slow if Render was asleep) |

---

## Troubleshooting

**Build fails — `nest: not found`**  
Render skips devDependencies by default. Use build command:  
`npm install --include=dev && npm run build`

**Build fails — TypeScript / `@types/node` errors**  
Same fix — full install with `--include=dev` before build.

**CORS errors in browser**  
Set `CORS_ORIGIN` to include both `https://www.webpulsesai.com` and `https://webpulsesai.com`.

**First request very slow (~1 min)**  
Normal on Render free tier — service was asleep. Later requests are fast.

**PageSpeed “API key not configured”**  
Add `GOOGLE_PSI_API_KEY` on Render and redeploy.

---

## Redeploy

Push to GitHub — Render and Vercel auto-deploy:

```bash
git push origin main
```
