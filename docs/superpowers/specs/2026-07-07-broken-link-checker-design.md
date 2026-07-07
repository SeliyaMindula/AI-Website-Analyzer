# Broken Link Checker — Design Spec

**Date:** 2026-07-07  
**Status:** Approved

## Summary

Add a whole-site broken link checker to WebPulses AI under Website & Network Tools. Users enter a URL; the backend crawls same-hostname pages, extracts links/images/scripts/stylesheets, checks each URL, and returns a report of broken assets.

## Requirements

| Setting | Value |
|---------|-------|
| Crawl scope | Whole site (BFS) |
| Domain | Same hostname only |
| Max pages | 50 |
| Max unique URLs checked | 250 |
| Max duration | 60 seconds |
| Assets scanned | `<a href>`, `<img src/srcset>`, `<script src>`, `<link rel="stylesheet">` |
| Broken definition | HTTP 4xx/5xx, timeout, connection error |
| API style | Single synchronous `POST /links/check` |

## Architecture

- **Backend:** `links/` NestJS module — crawler, extractor, checker
- **Frontend:** `/broken-links` page — `UrlForm`, summary cards, broken links table
- **Reuse:** `HttpFetcherService`, `validateUrl`, `assertPublicUrl`, cheerio

## API Response Shape

See implementation types in `backend/src/links/links.types.ts` and `frontend/src/types/tools.ts`.

## Safety

- SSRF guard on every outbound request
- Same-domain crawl only
- Hard caps on pages, links, and time
- Concurrency limit of 5 parallel checks

## SEO

Add route to `tools-config.ts`, `site-config.ts` ROUTES/keywords, sitemap via ROUTES.
