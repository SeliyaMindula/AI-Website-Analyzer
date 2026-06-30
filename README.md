# WebPulse AI

**Pulse-check the web** — site analysis, internet speed, DNS, SSL, uptime, and IP geolocation tools in one platform.

## Tools

| Route | Tool |
|-------|------|
| `/` | Tools hub |
| `/analyze` | Full website analysis (SEO, PSI, security, tech, PDF) |
| `/internet-speed` | Your connection speed (download, upload, ping, jitter) |
| `/dns` | DNS record lookup |
| `/ssl` | SSL certificate check |
| `/uptime` | Site reachability ping |
| `/ip` | IP / geolocation lookup |

## Prerequisites

- **Node.js 18+**
- **Google PageSpeed Insights API key** — required for `/analyze` only

## Quick start

### Backend

```bash
cd backend
cp .env.example .env
# Set GOOGLE_PSI_API_KEY for full analysis
npm install
npm run start:dev
```

API: `http://localhost:3001`

### Frontend

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/analyze` | Full website analysis |
| POST | `/report/pdf` | PDF report |
| GET | `/speed-test/ping` | Latency ping |
| GET | `/speed-test/download?size=1mb\|5mb` | Download test payload |
| POST | `/speed-test/upload` | Upload test (raw body) |
| POST | `/dns/lookup` | DNS lookup `{ domain }` |
| POST | `/ssl/check` | SSL check `{ domain }` |
| POST | `/uptime/check` | Uptime ping `{ url }` |
| POST | `/ip/lookup` | IP geolocation `{ query }` |

## Environment variables

### Backend (`backend/.env`)

| Variable | Required | Default |
|----------|----------|---------|
| `PORT` | No | `3001` |
| `CORS_ORIGIN` | No | `http://localhost:3000` |
| `GOOGLE_PSI_API_KEY` | For `/analyze` | — |
| `SUMMARY_PROVIDER` | No | `rule-based` |

### Frontend (`frontend/.env.local`)

| Variable | Required | Default |
|----------|----------|---------|
| `NEXT_PUBLIC_API_URL` | No | `http://localhost:3001` |

## Testing

```bash
cd backend && npm test && npm run test:e2e
cd frontend && npm run build
```

## Deployment

**Production domain:** [www.webpulsesai.com](https://www.webpulsesai.com)

Full step-by-step guide: **[docs/DEPLOY.md](docs/DEPLOY.md)** — **free hosting** with Vercel + Render ($0/month).

| Service | Host | Cost | Domain |
|---------|------|------|--------|
| Frontend (Next.js) | Vercel | Free | `www.webpulsesai.com` |
| Backend (NestJS) | Render | Free | `api.webpulsesai.com` |

Render free tier: API sleeps after 15 min idle; first request may take ~1 min to wake up.

### DNS (at your registrar)

| Type | Name | Value |
|------|------|-------|
| CNAME | `www` | Vercel target (from Vercel dashboard) |
| CNAME | `api` | Render target (from Render dashboard) |
| A or ALIAS | `@` | Redirect apex → `www` (or Vercel apex record) |

### Environment (production)

**Frontend (Vercel)**

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://api.webpulsesai.com` |
| `NEXT_PUBLIC_SITE_URL` | `https://www.webpulsesai.com` |

**Backend (Render)**

| Variable | Value |
|----------|-------|
| `CORS_ORIGIN` | `https://www.webpulsesai.com,https://webpulsesai.com` |
| `GOOGLE_PSI_API_KEY` | your PSI key |
| `PORT` | platform default (often injected) |

Local dev stays on `localhost` — do not change `.env` / `.env.local` until you deploy.
