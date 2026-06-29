# WebPulse AI Platform Implementation Plan

> **For agentic workers:** Use subagent-driven-development or executing-plans task-by-task.

**Goal:** Rebrand to WebPulse AI with tools hub and 5 tools: Analyze, Internet Speed, DNS, SSL, Uptime.

**Spec:** `docs/superpowers/specs/2026-06-29-webpulse-ai-platform-design.md`

---

### Task 1: Rebrand metadata and PDF footer

- Update `frontend/src/app/layout.tsx` metadata
- Update PDF footer in `pdf-generator.service.ts`
- Create placeholder `SiteHeader.tsx` with WebPulse AI

### Task 2: Tools hub and route restructure

- Move `app/page.tsx` → `app/analyze/page.tsx`
- Create new `app/page.tsx` hub with `ToolCard` grid (5 cards)
- Wire `SiteHeader` in layout

### Task 3: Speed-test backend module

- `speed-test.controller.ts`: GET ping, GET download, POST upload
- In-memory 1MB/5MB buffers for download
- Basic IP rate limiting
- e2e tests

### Task 4: Internet speed frontend

- `app/internet-speed/page.tsx` + `InternetSpeedTest.tsx`
- Client orchestration: ping → download → upload → results

### Task 5: DNS backend + frontend

- `dns.module.ts` with `dns.promises` lookups
- `app/dns/page.tsx` + results component
- Unit tests with mocked dns

### Task 6: SSL backend + frontend

- `ssl.module.ts` with `tls.connect`
- `app/ssl/page.tsx` + results component

### Task 7: Uptime backend + frontend

- `uptime.module.ts` reusing HttpFetcherService
- `app/uptime/page.tsx` + results component

### Task 8: README and verify

- Full README rebrand + all routes documented
- `npm test`, `npm run test:e2e`, frontend build
- Manual smoke all 6 routes
