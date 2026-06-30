# WebPulse AI — UI Visual Refresh (Clean Lab)

**Date:** 2026-06-30  
**Scope:** Visual refresh only (Option A) — no layout or routing changes  
**Direction:** Professional utility + modern polish + light/friendly (A + B + D)  
**Theme:** Clean Lab (Option 1)

---

## Goals

- Stop looking like a generic dark “AI SaaS” template
- Feel trustworthy and tool-first (DNS/GTmetrix energy)
- Light, approachable UI suitable for a portfolio production site
- Same page structure, components, and user flows

## Non-goals

- New pages, navigation model, or tool features
- Dark mode toggle (light-only for v1 refresh)
- Custom illustrations or marketing landing sections
- Backend changes

---

## Design tokens

| Token | Value | Usage |
|-------|-------|--------|
| `--background` | `#f8fafc` | Page background (slate-50) |
| `--surface` | `#ffffff` | Cards, header, inputs |
| `--foreground` | `#0f172a` | Primary text (slate-900) |
| `--muted` | `#64748b` | Secondary text (slate-500) |
| `--border` | `#e2e8f0` | Card/input borders (slate-200) |
| `--accent` | `#0d9488` | Primary actions, brand (teal-600) |
| `--accent-hover` | `#0f766e` | Button hover (teal-700) |
| `--accent-soft` | `#ccfbf1` | Icon backgrounds (teal-100) |
| `--success` | `#059669` | Good scores |
| `--warning` | `#d97706` | Medium scores |
| `--danger` | `#dc2626` | Poor scores |

Typography: keep **Geist Sans** + **Geist Mono** (already loaded). Headings use semibold/bold; mono for DNS/IP/code values.

---

## Components to update

### Global (`layout.tsx`, `globals.css`)

- Remove `dark` class from `<html>`
- Body: light background, dark text
- Optional subtle page texture: none (keep flat/clean)

### `SiteHeader`

- White surface, bottom border `--border`
- Logo: “WebPulse” in slate-900, “AI” in teal (drop indigo)
- Optional: small teal dot/pulse SVG mark before wordmark
- “All tools” link: muted slate, hover teal

### `ToolCard` + hub (`page.tsx`)

- Replace emoji with **Lucide React** icons (one per tool)
- Card: white bg, `border`, `shadow-sm`, hover `shadow-md` + teal border tint
- Icon in rounded square with `--accent-soft` background, teal icon stroke
- Hub hero: darker headline, muted subtitle; no gradient hero block

### Forms (`UrlForm`, `DomainForm`)

- Input: white bg, slate border, focus ring teal
- Button: teal bg, white text, hover darker teal
- Shared input/button classes via Tailwind (or small utility constants in each file — no new abstraction layer)

### Result cards (all `*Results`, `*Card` components)

- Replace `bg-zinc-900 border-zinc-800` with white surface + light border + shadow-sm
- Section titles: teal or slate-900 semibold
- Code/values: `font-mono text-sm text-slate-700`

### `ScoreBadge`

- Score colors mapped to success/warning/danger tokens for light bg

### Tool pages (`*/page.tsx`)

- Page titles: slate-900; subtitles: muted
- Error text: red-600; loading states unchanged functionally

---

## Icons mapping (Lucide)

| Tool | Icon |
|------|------|
| Analyze Site | `Search` or `ScanSearch` |
| Internet Speed | `Zap` |
| DNS Lookup | `Globe` |
| SSL Check | `ShieldCheck` |
| Uptime Ping | `Activity` |
| IP / Geolocation | `MapPin` |

---

## Dependencies

- Add `lucide-react` to `frontend/package.json`

---

## Files touched (estimated)

| File | Change |
|------|--------|
| `frontend/package.json` | Add lucide-react |
| `frontend/src/app/globals.css` | Light theme tokens |
| `frontend/src/app/layout.tsx` | Remove dark mode classes |
| `frontend/src/components/SiteHeader.tsx` | Light header styling |
| `frontend/src/components/ToolCard.tsx` | Lucide icons, card styles |
| `frontend/src/components/UrlForm.tsx` | Light form styles |
| `frontend/src/components/DomainForm.tsx` | Light form styles |
| `frontend/src/components/ScoreBadge.tsx` | Light score colors |
| `frontend/src/components/*Card.tsx` | Light result cards (6 files) |
| `frontend/src/components/*Results.tsx` | Light result panels (4 files) |
| `frontend/src/components/InternetSpeedTest.tsx` | Match form/card tokens |
| `frontend/src/app/page.tsx` | Hero text colors only |

No changes to `lib/api.ts`, routes, or backend.

---

## Testing

- `npm run build` in `frontend/` passes
- Visual spot-check: hub + one tool page (analyze) + one simple tool (dns)
- Mobile: grid and forms remain usable (existing responsive classes)

---

## Success criteria

- Site reads as a **professional web diagnostics tool**, not a generic AI dashboard
- Light theme throughout; no leftover zinc-950/indigo-600 on user-facing UI
- All 7 routes render correctly with consistent styling
