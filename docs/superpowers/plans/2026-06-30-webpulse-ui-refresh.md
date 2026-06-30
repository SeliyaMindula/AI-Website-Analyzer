# WebPulse UI Refresh (Clean Lab) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement task-by-task.

**Goal:** Light professional theme across frontend — teal accent, Lucide icons, no layout changes.

**Architecture:** CSS tokens in `globals.css`; remove `dark` from layout; update shared components first (header, forms, cards), then result panels.

**Tech Stack:** Next.js, Tailwind v4, lucide-react

**Spec:** `docs/superpowers/specs/2026-06-30-webpulse-ui-refresh-design.md`

---

### Task 1: Foundation
- [ ] Install `lucide-react`
- [ ] Update `globals.css` tokens + `layout.tsx` light body
- [ ] Update `SiteHeader.tsx`

### Task 2: Hub & forms
- [ ] Update `ToolCard.tsx` with Lucide icons
- [ ] Update `UrlForm.tsx`, `DomainForm.tsx`
- [ ] Update hub `page.tsx` text colors

### Task 3: Results & badges
- [ ] Update `ScoreBadge.tsx`
- [ ] Update all `*Card.tsx` and `*Results.tsx` + `InternetSpeedTest.tsx`

### Task 4: Tool page headings
- [ ] Replace zinc subtitle/error classes on tool pages

### Task 5: Verify
- [ ] `npm run build` in frontend
