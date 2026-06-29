# AI Website Analyzer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a portfolio full-stack app where users enter a URL, receive SEO/speed/security/tech analysis with a rule-based summary, and download a PDF report — Next.js frontend + NestJS backend.

**Architecture:** NestJS runs parallel analyzers (Cheerio SEO, header security, heuristics tech stack, Google PSI speed), aggregates via `AnalyzeService`, generates summary through pluggable provider (rule-based default). Next.js displays results and POSTs report JSON to `/report/pdf` for PDFKit-generated download. Stateless, no database.

**Tech Stack:** Next.js 14+ (App Router), NestJS 10+, TypeScript, Tailwind CSS, Cheerio, PDFKit, Jest, Google PageSpeed Insights API

**Spec:** `docs/superpowers/specs/2026-06-29-ai-website-analyzer-design.md`

---

## File Structure

```
/
├── README.md
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── UrlForm.tsx
│   │   │   ├── SummaryCard.tsx
│   │   │   ├── SeoCard.tsx
│   │   │   ├── SpeedCard.tsx
│   │   │   ├── SecurityCard.tsx
│   │   │   ├── TechStackCard.tsx
│   │   │   ├── ScoreBadge.tsx
│   │   │   └── DownloadPdfButton.tsx
│   │   ├── lib/
│   │   │   └── api.ts
│   │   └── types/
│   │       └── analysis.ts
│   └── .env.local.example
└── backend/
    ├── src/
    │   ├── main.ts
    │   ├── app.module.ts
    │   ├── types/
    │   │   └── analysis.types.ts
    │   ├── common/
    │   │   ├── url-validator.ts
    │   │   └── ssrf-guard.ts
    │   ├── fetcher/
    │   │   ├── http-fetcher.service.ts
    │   │   └── fetcher.module.ts
    │   ├── analyzers/
    │   │   ├── seo.analyzer.ts
    │   │   ├── security.analyzer.ts
    │   │   ├── tech-stack.analyzer.ts
    │   │   ├── speed.analyzer.ts
    │   │   └── analyzers.module.ts
    │   ├── summary/
    │   │   ├── summary-provider.interface.ts
    │   │   ├── rule-based-summary.provider.ts
    │   │   ├── openai-summary.provider.ts
    │   │   ├── anthropic-summary.provider.ts
    │   │   ├── summary.factory.ts
    │   │   └── summary.module.ts
    │   ├── analyze/
    │   │   ├── analyze.controller.ts
    │   │   ├── analyze.service.ts
    │   │   ├── analyze.dto.ts
    │   │   └── analyze.module.ts
    │   └── report/
    │       ├── report.controller.ts
    │       ├── report.service.ts
    │       ├── pdf-generator.service.ts
    │       └── report.module.ts
    ├── test/
    │   ├── url-validator.spec.ts
    │   ├── ssrf-guard.spec.ts
    │   ├── seo.analyzer.spec.ts
    │   ├── security.analyzer.spec.ts
    │   ├── tech-stack.analyzer.spec.ts
    │   ├── rule-based-summary.provider.spec.ts
    │   ├── pdf-generator.service.spec.ts
    │   └── analyze.e2e-spec.ts
    └── .env.example
```

---

### Task 1: Scaffold monorepo and NestJS backend

**Files:**
- Create: `backend/` (NestJS project)
- Create: `README.md` (minimal placeholder)

- [ ] **Step 1: Create NestJS backend**

Run from repo root:
```bash
npx @nestjs/cli new backend --package-manager npm --skip-git --strict
```
Expected: `backend/` created with `src/main.ts`, `package.json`.

- [ ] **Step 2: Install backend dependencies**

```bash
cd backend
npm install cheerio pdfkit class-validator class-transformer
npm install -D @types/pdfkit
```

- [ ] **Step 3: Create root README**

Create `README.md`:
```markdown
# AI Website Analyzer

Analyze any website for SEO, speed, security headers, and tech stack.

## Quick start

See `backend/README` setup and `frontend/README` setup. Run both locally:

- Backend: `cd backend && npm run start:dev` (port 3001)
- Frontend: `cd frontend && npm run dev` (port 3000)
```

- [ ] **Step 4: Commit**

```bash
git init
git add backend/ README.md docs/
git commit -m "chore: scaffold NestJS backend and project docs"
```

---

### Task 2: Analysis types (backend)

**Files:**
- Create: `backend/src/types/analysis.types.ts`

- [ ] **Step 1: Create types file**

```typescript
// backend/src/types/analysis.types.ts

export type IssueSeverity = 'error' | 'warning' | 'info';
export type Grade = 'A' | 'B' | 'C' | 'D' | 'F';
export type RecommendationPriority = 'high' | 'medium' | 'low';
export type RecommendationCategory = 'seo' | 'security' | 'speed' | 'tech';
export type HeaderStatus = 'present' | 'missing' | 'weak';
export type TechConfidence = 'high' | 'medium' | 'low';

export interface Issue {
  severity: IssueSeverity;
  message: string;
}

export interface SectionError {
  error: string;
}

export interface SeoResult {
  score: number;
  title: { present: boolean; content?: string; length?: number };
  metaDescription: { present: boolean; content?: string; length?: number };
  canonical?: string;
  robots?: string;
  h1Count: number;
  h1Texts: string[];
  openGraph: { title?: string; description?: string; image?: string };
  lang?: string;
  images: { total: number; withAlt: number; withoutAlt: number };
  issues: Issue[];
}

export interface SecurityHeaderCheck {
  name: string;
  status: HeaderStatus;
  value?: string;
}

export interface SecurityResult {
  score: number;
  headers: SecurityHeaderCheck[];
  issues: Issue[];
}

export interface Technology {
  name: string;
  category: string;
  confidence: TechConfidence;
}

export interface TechStackResult {
  technologies: Technology[];
}

export interface VitalMetric {
  value: string;
  pass: boolean;
}

export interface SpeedOpportunity {
  title: string;
  savings?: string;
}

export interface SpeedResult {
  performanceScore: number;
  lcp: VitalMetric;
  cls: VitalMetric;
  inp: VitalMetric;
  opportunities: SpeedOpportunity[];
}

export interface Recommendation {
  priority: RecommendationPriority;
  category: RecommendationCategory;
  message: string;
}

export interface AnalysisSummary {
  grade: Grade;
  overview: string;
  recommendations: Recommendation[];
}

export interface AnalysisReport {
  url: string;
  analyzedAt: string;
  summary: AnalysisSummary;
  seo: SeoResult | SectionError;
  security: SecurityResult | SectionError;
  speed: SpeedResult | SectionError;
  techStack: TechStackResult | SectionError;
}

export interface RawAnalysisReport {
  url: string;
  seo: SeoResult | SectionError;
  security: SecurityResult | SectionError;
  speed: SpeedResult | SectionError;
  techStack: TechStackResult | SectionError;
}

export interface FetchResult {
  html: string;
  headers: Record<string, string>;
  finalUrl: string;
  statusCode: number;
}

export function isSectionError(
  section: SeoResult | SecurityResult | SpeedResult | TechStackResult | SectionError,
): section is SectionError {
  return 'error' in section;
}
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/types/analysis.types.ts
git commit -m "feat: add shared analysis types"
```

---

### Task 3: URL validator and SSRF guard

**Files:**
- Create: `backend/src/common/url-validator.ts`
- Create: `backend/src/common/ssrf-guard.ts`
- Create: `backend/test/url-validator.spec.ts`
- Create: `backend/test/ssrf-guard.spec.ts`

- [ ] **Step 1: Write failing URL validator tests**

```typescript
// backend/test/url-validator.spec.ts
import { normalizeUrl, validateUrl } from '../src/common/url-validator';

describe('validateUrl', () => {
  it('accepts https URL', () => {
    expect(validateUrl('https://example.com')).toBe('https://example.com/');
  });

  it('prepends https when missing scheme', () => {
    expect(validateUrl('example.com')).toBe('https://example.com/');
  });

  it('rejects invalid URL', () => {
    expect(() => validateUrl('not a url')).toThrow('Please enter a valid URL');
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
cd backend && npm test -- url-validator.spec.ts
```

- [ ] **Step 3: Implement url-validator**

```typescript
// backend/src/common/url-validator.ts
export function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

export function validateUrl(input: string): string {
  try {
    const normalized = normalizeUrl(input);
    const parsed = new URL(normalized);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('Please enter a valid URL');
    }
    return parsed.href;
  } catch {
    throw new Error('Please enter a valid URL');
  }
}
```

- [ ] **Step 4: Write failing SSRF guard tests**

```typescript
// backend/test/ssrf-guard.spec.ts
import { assertPublicUrl } from '../src/common/ssrf-guard';

describe('assertPublicUrl', () => {
  it('blocks localhost', () => {
    expect(() => assertPublicUrl('http://localhost/path')).toThrow(
      'Cannot analyze local or private addresses',
    );
  });

  it('blocks private IP', () => {
    expect(() => assertPublicUrl('http://192.168.1.1/')).toThrow(
      'Cannot analyze local or private addresses',
    );
  });

  it('allows public URL', () => {
    expect(() => assertPublicUrl('https://example.com/')).not.toThrow();
  });
});
```

- [ ] **Step 5: Implement ssrf-guard**

```typescript
// backend/src/common/ssrf-guard.ts
import { URL } from 'url';

const BLOCKED_HOSTNAMES = new Set(['localhost', '0.0.0.0']);

function isPrivateIpv4(host: string): boolean {
  const match = host.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  if (!match) return false;
  const [, a, b] = match.map(Number);
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 192 && b === 168) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  return false;
}

export function assertPublicUrl(url: string): void {
  const { hostname } = new URL(url);
  const host = hostname.toLowerCase();
  if (BLOCKED_HOSTNAMES.has(host) || host.endsWith('.local')) {
    throw new Error('Cannot analyze local or private addresses');
  }
  if (isPrivateIpv4(host)) {
    throw new Error('Cannot analyze local or private addresses');
  }
}
```

- [ ] **Step 6: Run tests — expect PASS**

```bash
cd backend && npm test -- url-validator.spec.ts ssrf-guard.spec.ts
```

- [ ] **Step 7: Commit**

```bash
git add backend/src/common/ backend/test/url-validator.spec.ts backend/test/ssrf-guard.spec.ts
git commit -m "feat: add URL validation and SSRF guard"
```

---

### Task 4: HttpFetcherService

**Files:**
- Create: `backend/src/fetcher/http-fetcher.service.ts`
- Create: `backend/src/fetcher/fetcher.module.ts`

- [ ] **Step 1: Implement HttpFetcherService**

```typescript
// backend/src/fetcher/http-fetcher.service.ts
import { Injectable, BadRequestException, GatewayTimeoutException } from '@nestjs/common';
import { FetchResult } from '../types/analysis.types';
import { validateUrl } from '../common/url-validator';
import { assertPublicUrl } from '../common/ssrf-guard';

const TIMEOUT_MS = 10_000;
const MAX_REDIRECTS = 5;

@Injectable()
export class HttpFetcherService {
  async fetch(urlInput: string): Promise<FetchResult> {
    let currentUrl = validateUrl(urlInput);
    assertPublicUrl(currentUrl);

    let redirects = 0;
    while (redirects <= MAX_REDIRECTS) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
      try {
        const response = await fetch(currentUrl, {
          signal: controller.signal,
          redirect: 'manual',
          headers: { 'User-Agent': 'AI-Website-Analyzer/1.0' },
        });
        clearTimeout(timer);

        if (response.status >= 300 && response.status < 400) {
          const location = response.headers.get('location');
          if (!location) break;
          currentUrl = new URL(location, currentUrl).href;
          assertPublicUrl(currentUrl);
          redirects++;
          continue;
        }

        const html = await response.text();
        const headers: Record<string, string> = {};
        response.headers.forEach((value, key) => {
          headers[key.toLowerCase()] = value;
        });

        return {
          html,
          headers,
          finalUrl: currentUrl,
          statusCode: response.status,
        };
      } catch (err) {
        clearTimeout(timer);
        if (err instanceof Error && err.name === 'AbortError') {
          throw new GatewayTimeoutException('Could not reach website in time');
        }
        if (err instanceof BadRequestException) throw err;
        throw new BadRequestException('Could not reach website');
      }
    }
    throw new BadRequestException('Too many redirects');
  }
}
```

```typescript
// backend/src/fetcher/fetcher.module.ts
import { Module } from '@nestjs/common';
import { HttpFetcherService } from './http-fetcher.service';

@Module({
  providers: [HttpFetcherService],
  exports: [HttpFetcherService],
})
export class FetcherModule {}
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/fetcher/
git commit -m "feat: add HTTP fetcher with SSRF and redirect handling"
```

---

### Task 5: SeoAnalyzer

**Files:**
- Create: `backend/src/analyzers/seo.analyzer.ts`
- Create: `backend/test/seo.analyzer.spec.ts`

- [ ] **Step 1: Write failing SEO analyzer test**

```typescript
// backend/test/seo.analyzer.spec.ts
import { SeoAnalyzer } from '../src/analyzers/seo.analyzer';

const analyzer = new SeoAnalyzer();

const FIXTURE_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Test Page Title Here</title>
  <meta name="description" content="A test description for SEO.">
  <link rel="canonical" href="https://example.com/page">
  <meta property="og:title" content="OG Title">
</head>
<body>
  <h1>Main Heading</h1>
  <img src="a.jpg" alt="described">
  <img src="b.jpg">
</body>
</html>`;

describe('SeoAnalyzer', () => {
  it('scores page with title and meta', () => {
    const result = analyzer.analyze({
      html: FIXTURE_HTML,
      headers: {},
      finalUrl: 'https://example.com',
      statusCode: 200,
    });
    expect(result.score).toBeGreaterThan(50);
    expect(result.title.present).toBe(true);
    expect(result.h1Count).toBe(1);
    expect(result.images.withoutAlt).toBe(1);
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
cd backend && npm test -- seo.analyzer.spec.ts
```

- [ ] **Step 3: Implement SeoAnalyzer**

```typescript
// backend/src/analyzers/seo.analyzer.ts
import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { FetchResult, Issue, SeoResult } from '../types/analysis.types';

@Injectable()
export class SeoAnalyzer {
  analyze(fetch: FetchResult): SeoResult {
    const $ = cheerio.load(fetch.html);
    const issues: Issue[] = [];

    const titleText = $('title').first().text().trim();
    const title = {
      present: titleText.length > 0,
      content: titleText || undefined,
      length: titleText.length || undefined,
    };
    if (!title.present) issues.push({ severity: 'error', message: 'Missing <title> tag' });
    else if (titleText.length < 30 || titleText.length > 60) {
      issues.push({ severity: 'warning', message: 'Title length should be 30–60 characters' });
    }

    const metaDesc = $('meta[name="description"]').attr('content')?.trim() ?? '';
    const metaDescription = {
      present: metaDesc.length > 0,
      content: metaDesc || undefined,
      length: metaDesc.length || undefined,
    };
    if (!metaDescription.present) {
      issues.push({ severity: 'error', message: 'Missing meta description' });
    }

    const h1Texts = $('h1').map((_, el) => $(el).text().trim()).get().filter(Boolean);
    if (h1Texts.length === 0) issues.push({ severity: 'error', message: 'Missing H1 heading' });
    if (h1Texts.length > 1) issues.push({ severity: 'warning', message: 'Multiple H1 headings found' });

    const images = $('img');
    let withAlt = 0;
    let withoutAlt = 0;
    images.each((_, el) => {
      const alt = $(el).attr('alt');
      if (alt && alt.trim()) withAlt++;
      else withoutAlt++;
    });
    if (withoutAlt > 0) {
      issues.push({ severity: 'warning', message: `${withoutAlt} image(s) missing alt text` });
    }

    const score = Math.max(0, 100 - issues.filter((i) => i.severity === 'error').length * 20
      - issues.filter((i) => i.severity === 'warning').length * 10);

    return {
      score,
      title,
      metaDescription,
      canonical: $('link[rel="canonical"]').attr('href'),
      robots: $('meta[name="robots"]').attr('content') ?? fetch.headers['x-robots-tag'],
      h1Count: h1Texts.length,
      h1Texts,
      openGraph: {
        title: $('meta[property="og:title"]').attr('content'),
        description: $('meta[property="og:description"]').attr('content'),
        image: $('meta[property="og:image"]').attr('content'),
      },
      lang: $('html').attr('lang'),
      images: { total: images.length, withAlt, withoutAlt },
      issues,
    };
  }
}
```

- [ ] **Step 4: Run test — expect PASS**

```bash
cd backend && npm test -- seo.analyzer.spec.ts
```

- [ ] **Step 5: Commit**

```bash
git add backend/src/analyzers/seo.analyzer.ts backend/test/seo.analyzer.spec.ts
git commit -m "feat: add SEO analyzer"
```

---

### Task 6: SecurityAnalyzer

**Files:**
- Create: `backend/src/analyzers/security.analyzer.ts`
- Create: `backend/test/security.analyzer.spec.ts`

- [ ] **Step 1: Write failing test**

```typescript
// backend/test/security.analyzer.spec.ts
import { SecurityAnalyzer } from '../src/analyzers/security.analyzer';

const analyzer = new SecurityAnalyzer();

describe('SecurityAnalyzer', () => {
  it('flags missing security headers', () => {
    const result = analyzer.analyze({
      html: '<html></html>',
      headers: { 'x-frame-options': 'DENY' },
      finalUrl: 'https://example.com',
      statusCode: 200,
    });
    expect(result.headers.find((h) => h.name === 'X-Frame-Options')?.status).toBe('present');
    expect(result.headers.find((h) => h.name === 'Strict-Transport-Security')?.status).toBe('missing');
    expect(result.score).toBeLessThan(100);
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
cd backend && npm test -- security.analyzer.spec.ts
```

- [ ] **Step 3: Implement SecurityAnalyzer**

```typescript
// backend/src/analyzers/security.analyzer.ts
import { Injectable } from '@nestjs/common';
import { FetchResult, Issue, SecurityHeaderCheck, SecurityResult } from '../types/analysis.types';

const SECURITY_HEADERS = [
  { name: 'Content-Security-Policy', key: 'content-security-policy' },
  { name: 'Strict-Transport-Security', key: 'strict-transport-security' },
  { name: 'X-Frame-Options', key: 'x-frame-options' },
  { name: 'X-Content-Type-Options', key: 'x-content-type-options' },
  { name: 'Referrer-Policy', key: 'referrer-policy' },
  { name: 'Permissions-Policy', key: 'permissions-policy' },
] as const;

@Injectable()
export class SecurityAnalyzer {
  analyze(fetch: FetchResult): SecurityResult {
    const issues: Issue[] = [];
    const headers: SecurityHeaderCheck[] = SECURITY_HEADERS.map(({ name, key }) => {
      const value = fetch.headers[key];
      const status = value ? 'present' : 'missing';
      if (!value) issues.push({ severity: 'warning', message: `Missing ${name} header` });
      return { name, status, value };
    });

    const presentCount = headers.filter((h) => h.status === 'present').length;
    const score = Math.round((presentCount / headers.length) * 100);

    return { score, headers, issues };
  }
}
```

- [ ] **Step 4: Run test — expect PASS**

```bash
cd backend && npm test -- security.analyzer.spec.ts
```

- [ ] **Step 5: Commit**

```bash
git add backend/src/analyzers/security.analyzer.ts backend/test/security.analyzer.spec.ts
git commit -m "feat: add security header analyzer"
```

---

### Task 7: TechStackAnalyzer

**Files:**
- Create: `backend/src/analyzers/tech-stack.analyzer.ts`
- Create: `backend/test/tech-stack.analyzer.spec.ts`

- [ ] **Step 1: Write failing test**

```typescript
// backend/test/tech-stack.analyzer.spec.ts
import { TechStackAnalyzer } from '../src/analyzers/tech-stack.analyzer';

const analyzer = new TechStackAnalyzer();

describe('TechStackAnalyzer', () => {
  it('detects WordPress', () => {
    const result = analyzer.analyze({
      html: '<meta name="generator" content="WordPress 6.4">',
      headers: {},
      finalUrl: 'https://example.com',
      statusCode: 200,
    });
    expect(result.technologies.some((t) => t.name === 'WordPress')).toBe(true);
  });

  it('detects React from bundle', () => {
    const result = analyzer.analyze({
      html: '<script src="/_next/static/chunks/main.js"></script>',
      headers: { 'x-powered-by': 'Next.js' },
      finalUrl: 'https://example.com',
      statusCode: 200,
    });
    expect(result.technologies.some((t) => t.name === 'Next.js')).toBe(true);
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
cd backend && npm test -- tech-stack.analyzer.spec.ts
```

- [ ] **Step 3: Implement TechStackAnalyzer**

```typescript
// backend/src/analyzers/tech-stack.analyzer.ts
import { Injectable } from '@nestjs/common';
import { FetchResult, TechStackResult, Technology } from '../types/analysis.types';

interface DetectionRule {
  name: string;
  category: string;
  test: (fetch: FetchResult) => boolean;
}

const RULES: DetectionRule[] = [
  { name: 'WordPress', category: 'CMS', test: (f) => /wordpress/i.test(f.html) },
  { name: 'Shopify', category: 'CMS', test: (f) => /cdn\.shopify\.com/i.test(f.html) },
  { name: 'Next.js', category: 'Framework', test: (f) => /_next\//i.test(f.html) || /next\.js/i.test(f.headers['x-powered-by'] ?? '') },
  { name: 'React', category: 'Framework', test: (f) => /react/i.test(f.html) || /__NEXT_DATA__/i.test(f.html) },
  { name: 'Vue', category: 'Framework', test: (f) => /vue/i.test(f.html) },
  { name: 'Angular', category: 'Framework', test: (f) => /ng-version/i.test(f.html) },
  { name: 'Cloudflare', category: 'CDN', test: (f) => /cloudflare/i.test(f.headers['server'] ?? '') },
  { name: 'Google Analytics', category: 'Analytics', test: (f) => /google-analytics\.com|gtag\(/i.test(f.html) },
  { name: 'Google Tag Manager', category: 'Analytics', test: (f) => /googletagmanager\.com/i.test(f.html) },
];

@Injectable()
export class TechStackAnalyzer {
  analyze(fetch: FetchResult): TechStackResult {
    const technologies: Technology[] = RULES.filter((r) => r.test(fetch)).map((r) => ({
      name: r.name,
      category: r.category,
      confidence: 'high' as const,
    }));
    return { technologies };
  }
}
```

- [ ] **Step 4: Run test — expect PASS**

```bash
cd backend && npm test -- tech-stack.analyzer.spec.ts
```

- [ ] **Step 5: Commit**

```bash
git add backend/src/analyzers/tech-stack.analyzer.ts backend/test/tech-stack.analyzer.spec.ts
git commit -m "feat: add tech stack analyzer"
```

---

### Task 8: SpeedAnalyzer (PageSpeed Insights)

**Files:**
- Create: `backend/src/analyzers/speed.analyzer.ts`

- [ ] **Step 1: Implement SpeedAnalyzer**

```typescript
// backend/src/analyzers/speed.analyzer.ts
import { Injectable } from '@nestjs/common';
import { SectionError, SpeedResult, VitalMetric } from '../types/analysis.types';

@Injectable()
export class SpeedAnalyzer {
  async analyze(url: string): Promise<SpeedResult | SectionError> {
    const apiKey = process.env.GOOGLE_PSI_API_KEY;
    if (!apiKey) {
      return { error: 'PageSpeed API key not configured' };
    }

    const endpoint = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed');
    endpoint.searchParams.set('url', url);
    endpoint.searchParams.set('strategy', 'mobile');
    endpoint.searchParams.set('category', 'performance');
    endpoint.searchParams.set('key', apiKey);

    try {
      const res = await fetch(endpoint.href);
      if (!res.ok) return { error: 'PageSpeed analysis failed' };
      const data = await res.json();
      const lighthouse = data.lighthouseResult;
      const audits = lighthouse.audits;

      const toVital = (id: string, passThreshold: number, lowerIsBetter = true): VitalMetric => {
        const audit = audits[id];
        const raw = audit?.numericValue ?? 0;
        const display = audit?.displayValue ?? String(raw);
        const pass = lowerIsBetter ? raw <= passThreshold : raw >= passThreshold;
        return { value: display, pass };
      };

      const opportunities = Object.values(audits)
        .filter((a: { details?: { type?: string }; score?: number }) => a.details?.type === 'opportunity' && (a.score ?? 1) < 1)
        .slice(0, 3)
        .map((a: { title: string; displayValue?: string }) => ({
          title: a.title,
          savings: a.displayValue,
        }));

      return {
        performanceScore: Math.round((lighthouse.categories.performance.score ?? 0) * 100),
        lcp: toVital('largest-contentful-paint', 2500),
        cls: toVital('cumulative-layout-shift', 0.1),
        inp: toVital('interaction-to-next-paint', 200),
        opportunities,
      };
    } catch {
      return { error: 'PageSpeed analysis failed' };
    }
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/analyzers/speed.analyzer.ts
git commit -m "feat: add PageSpeed Insights speed analyzer"
```

---

### Task 9: RuleBasedSummaryProvider

**Files:**
- Create: `backend/src/summary/summary-provider.interface.ts`
- Create: `backend/src/summary/rule-based-summary.provider.ts`
- Create: `backend/test/rule-based-summary.provider.spec.ts`

- [ ] **Step 1: Write failing test**

```typescript
// backend/test/rule-based-summary.provider.spec.ts
import { RuleBasedSummaryProvider } from '../src/summary/rule-based-summary.provider';
import { RawAnalysisReport } from '../src/types/analysis.types';

const provider = new RuleBasedSummaryProvider();

const baseReport: RawAnalysisReport = {
  url: 'https://example.com',
  seo: { score: 80, title: { present: true }, metaDescription: { present: true }, h1Count: 1, h1Texts: ['Hi'], openGraph: {}, images: { total: 0, withAlt: 0, withoutAlt: 0 }, issues: [] },
  security: { score: 40, headers: [], issues: [{ severity: 'warning', message: 'Missing HSTS' }] },
  speed: { performanceScore: 90, lcp: { value: '1s', pass: true }, cls: { value: '0', pass: true }, inp: { value: '100ms', pass: true }, opportunities: [] },
  techStack: { technologies: [] },
};

describe('RuleBasedSummaryProvider', () => {
  it('generates grade and recommendations', async () => {
    const summary = await provider.generate(baseReport);
    expect(['A', 'B', 'C', 'D', 'F']).toContain(summary.grade);
    expect(summary.overview.length).toBeGreaterThan(10);
    expect(summary.recommendations.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
cd backend && npm test -- rule-based-summary.provider.spec.ts
```

- [ ] **Step 3: Implement summary provider**

```typescript
// backend/src/summary/summary-provider.interface.ts
import { AnalysisSummary, RawAnalysisReport } from '../types/analysis.types';

export interface SummaryProvider {
  generate(report: RawAnalysisReport): Promise<AnalysisSummary>;
}
```

```typescript
// backend/src/summary/rule-based-summary.provider.ts
import { Injectable } from '@nestjs/common';
import { AnalysisSummary, Grade, RawAnalysisReport, Recommendation, isSectionError } from '../types/analysis.types';
import { SummaryProvider } from './summary-provider.interface';

@Injectable()
export class RuleBasedSummaryProvider implements SummaryProvider {
  async generate(report: RawAnalysisReport): Promise<AnalysisSummary> {
    const scores: number[] = [];
    const recommendations: Recommendation[] = [];

    if (!isSectionError(report.seo)) {
      scores.push(report.seo.score);
      report.seo.issues.slice(0, 2).forEach((i) =>
        recommendations.push({ priority: i.severity === 'error' ? 'high' : 'medium', category: 'seo', message: i.message }),
      );
    }
    if (!isSectionError(report.security)) {
      scores.push(report.security.score);
      report.security.issues.slice(0, 2).forEach((i) =>
        recommendations.push({ priority: 'medium', category: 'security', message: i.message }),
      );
    }
    if (!isSectionError(report.speed)) {
      scores.push(report.speed.performanceScore);
      if (report.speed.performanceScore < 80) {
        recommendations.push({ priority: 'high', category: 'speed', message: 'Improve mobile performance score' });
      }
    }

    const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 50;
    const grade = this.toGrade(avg);
    const overview = `Analysis of ${report.url} shows an overall ${grade} grade (average score ${Math.round(avg)}). Review the recommendations below to improve SEO, security, and performance.`;

    return {
      grade,
      overview,
      recommendations: recommendations.slice(0, 5),
    };
  }

  private toGrade(avg: number): Grade {
    if (avg >= 90) return 'A';
    if (avg >= 80) return 'B';
    if (avg >= 70) return 'C';
    if (avg >= 60) return 'D';
    return 'F';
  }
}
```

- [ ] **Step 4: Run test — expect PASS**

```bash
cd backend && npm test -- rule-based-summary.provider.spec.ts
```

- [ ] **Step 5: Commit**

```bash
git add backend/src/summary/ backend/test/rule-based-summary.provider.spec.ts
git commit -m "feat: add rule-based summary provider"
```

---

### Task 10: Summary factory and LLM stubs

**Files:**
- Create: `backend/src/summary/openai-summary.provider.ts`
- Create: `backend/src/summary/anthropic-summary.provider.ts`
- Create: `backend/src/summary/summary.factory.ts`
- Create: `backend/src/summary/summary.module.ts`

- [ ] **Step 1: Create stubs and factory**

```typescript
// backend/src/summary/openai-summary.provider.ts
import { Injectable } from '@nestjs/common';
import { SummaryProvider } from './summary-provider.interface';
import { AnalysisSummary, RawAnalysisReport } from '../types/analysis.types';

@Injectable()
export class OpenAiSummaryProvider implements SummaryProvider {
  async generate(_report: RawAnalysisReport): Promise<AnalysisSummary> {
    throw new Error('OpenAI summary provider not implemented in v1');
  }
}
```

```typescript
// backend/src/summary/anthropic-summary.provider.ts
import { Injectable } from '@nestjs/common';
import { SummaryProvider } from './summary-provider.interface';
import { AnalysisSummary, RawAnalysisReport } from '../types/analysis.types';

@Injectable()
export class AnthropicSummaryProvider implements SummaryProvider {
  async generate(_report: RawAnalysisReport): Promise<AnalysisSummary> {
    throw new Error('Anthropic summary provider not implemented in v1');
  }
}
```

```typescript
// backend/src/summary/summary.factory.ts
import { Injectable } from '@nestjs/common';
import { SummaryProvider } from './summary-provider.interface';
import { RuleBasedSummaryProvider } from './rule-based-summary.provider';
import { OpenAiSummaryProvider } from './openai-summary.provider';
import { AnthropicSummaryProvider } from './anthropic-summary.provider';

@Injectable()
export class SummaryFactory {
  constructor(
    private readonly ruleBased: RuleBasedSummaryProvider,
    private readonly openai: OpenAiSummaryProvider,
    private readonly anthropic: AnthropicSummaryProvider,
  ) {}

  getProvider(): SummaryProvider {
    const kind = process.env.SUMMARY_PROVIDER ?? 'rule-based';
    if (kind === 'openai') return this.openai;
    if (kind === 'anthropic') return this.anthropic;
    return this.ruleBased;
  }
}
```

```typescript
// backend/src/summary/summary.module.ts
import { Module } from '@nestjs/common';
import { RuleBasedSummaryProvider } from './rule-based-summary.provider';
import { OpenAiSummaryProvider } from './openai-summary.provider';
import { AnthropicSummaryProvider } from './anthropic-summary.provider';
import { SummaryFactory } from './summary.factory';

@Module({
  providers: [RuleBasedSummaryProvider, OpenAiSummaryProvider, AnthropicSummaryProvider, SummaryFactory],
  exports: [SummaryFactory],
})
export class SummaryModule {}
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/summary/
git commit -m "feat: add summary factory and LLM provider stubs"
```

---

### Task 11: AnalyzeService and controller

**Files:**
- Create: `backend/src/analyzers/analyzers.module.ts`
- Create: `backend/src/analyze/analyze.dto.ts`
- Create: `backend/src/analyze/analyze.service.ts`
- Create: `backend/src/analyze/analyze.controller.ts`
- Create: `backend/src/analyze/analyze.module.ts`

- [ ] **Step 1: Create analyzers module**

```typescript
// backend/src/analyzers/analyzers.module.ts
import { Module } from '@nestjs/common';
import { SeoAnalyzer } from './seo.analyzer';
import { SecurityAnalyzer } from './security.analyzer';
import { TechStackAnalyzer } from './tech-stack.analyzer';
import { SpeedAnalyzer } from './speed.analyzer';

@Module({
  providers: [SeoAnalyzer, SecurityAnalyzer, TechStackAnalyzer, SpeedAnalyzer],
  exports: [SeoAnalyzer, SecurityAnalyzer, TechStackAnalyzer, SpeedAnalyzer],
})
export class AnalyzersModule {}
```

- [ ] **Step 2: Create DTO, service, controller**

```typescript
// backend/src/analyze/analyze.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class AnalyzeDto {
  @IsString()
  @IsNotEmpty()
  url!: string;
}
```

```typescript
// backend/src/analyze/analyze.service.ts
import { Injectable } from '@nestjs/common';
import { HttpFetcherService } from '../fetcher/http-fetcher.service';
import { SeoAnalyzer } from '../analyzers/seo.analyzer';
import { SecurityAnalyzer } from '../analyzers/security.analyzer';
import { TechStackAnalyzer } from '../analyzers/tech-stack.analyzer';
import { SpeedAnalyzer } from '../analyzers/speed.analyzer';
import { SummaryFactory } from '../summary/summary.factory';
import { AnalysisReport, SectionError } from '../types/analysis.types';

@Injectable()
export class AnalyzeService {
  constructor(
    private readonly fetcher: HttpFetcherService,
    private readonly seo: SeoAnalyzer,
    private readonly security: SecurityAnalyzer,
    private readonly tech: TechStackAnalyzer,
    private readonly speed: SpeedAnalyzer,
    private readonly summaryFactory: SummaryFactory,
  ) {}

  async analyze(url: string): Promise<AnalysisReport> {
    let fetchResult;
    try {
      fetchResult = await this.fetcher.fetch(url);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not reach website';
      const sectionError: SectionError = { error: message };
      return {
        url,
        analyzedAt: new Date().toISOString(),
        summary: { grade: 'F', overview: message, recommendations: [] },
        seo: sectionError,
        security: sectionError,
        speed: await this.speed.analyze(url),
        techStack: sectionError,
      };
    }

    const [seoSettled, secSettled, techSettled, speedSettled] = await Promise.allSettled([
      Promise.resolve(this.seo.analyze(fetchResult)),
      Promise.resolve(this.security.analyze(fetchResult)),
      Promise.resolve(this.tech.analyze(fetchResult)),
      this.speed.analyze(fetchResult.finalUrl),
    ]);

    const unwrap = <T>(r: PromiseSettledResult<T>, fallback: SectionError): T | SectionError =>
      r.status === 'fulfilled' ? r.value : { error: 'Analysis failed' };

    const seo = unwrap(seoSettled, { error: 'SEO analysis failed' });
    const security = unwrap(secSettled, { error: 'Security analysis failed' });
    const techStack = unwrap(techSettled, { error: 'Tech stack analysis failed' });
    const speed = unwrap(speedSettled, { error: 'Speed analysis failed' });

    const raw = { url: fetchResult.finalUrl, seo, security, speed, techStack };
    const summary = await this.summaryFactory.getProvider().generate(raw);

    return { url: fetchResult.finalUrl, analyzedAt: new Date().toISOString(), summary, ...raw };
  }
}
```

```typescript
// backend/src/analyze/analyze.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { AnalyzeService } from './analyze.service';
import { AnalyzeDto } from './analyze.dto';

@Controller('analyze')
export class AnalyzeController {
  constructor(private readonly analyzeService: AnalyzeService) {}

  @Post()
  analyze(@Body() dto: AnalyzeDto) {
    return this.analyzeService.analyze(dto.url);
  }
}
```

```typescript
// backend/src/analyze/analyze.module.ts
import { Module } from '@nestjs/common';
import { AnalyzeController } from './analyze.controller';
import { AnalyzeService } from './analyze.service';
import { FetcherModule } from '../fetcher/fetcher.module';
import { AnalyzersModule } from '../analyzers/analyzers.module';
import { SummaryModule } from '../summary/summary.module';

@Module({
  imports: [FetcherModule, AnalyzersModule, SummaryModule],
  controllers: [AnalyzeController],
  providers: [AnalyzeService],
})
export class AnalyzeModule {}
```

- [ ] **Step 3: Commit**

```bash
git add backend/src/analyze/ backend/src/analyzers/analyzers.module.ts
git commit -m "feat: add analyze orchestration endpoint"
```

---

### Task 12: PDF report generation

**Files:**
- Create: `backend/src/report/pdf-generator.service.ts`
- Create: `backend/src/report/report.service.ts`
- Create: `backend/src/report/report.controller.ts`
- Create: `backend/src/report/report.module.ts`
- Create: `backend/test/pdf-generator.service.spec.ts`

- [ ] **Step 1: Write failing PDF generator test**

```typescript
// backend/test/pdf-generator.service.spec.ts
import { PdfGeneratorService } from '../src/report/pdf-generator.service';
import { AnalysisReport } from '../src/types/analysis.types';

const service = new PdfGeneratorService();

const FIXTURE_REPORT: AnalysisReport = {
  url: 'https://example.com',
  analyzedAt: '2026-06-29T12:00:00.000Z',
  summary: { grade: 'B', overview: 'Good site.', recommendations: [{ priority: 'medium', category: 'seo', message: 'Add meta' }] },
  seo: { score: 80, title: { present: true, content: 'Title' }, metaDescription: { present: true }, h1Count: 1, h1Texts: ['H1'], openGraph: {}, images: { total: 0, withAlt: 0, withoutAlt: 0 }, issues: [] },
  security: { score: 60, headers: [], issues: [] },
  speed: { performanceScore: 75, lcp: { value: '2s', pass: true }, cls: { value: '0.05', pass: true }, inp: { value: '150ms', pass: true }, opportunities: [] },
  techStack: { technologies: [{ name: 'React', category: 'Framework', confidence: 'high' }] },
};

describe('PdfGeneratorService', () => {
  it('returns non-empty PDF buffer', async () => {
    const buffer = await service.generate(FIXTURE_REPORT);
    expect(buffer.length).toBeGreaterThan(100);
    expect(buffer.subarray(0, 4).toString()).toBe('%PDF');
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
cd backend && npm test -- pdf-generator.service.spec.ts
```

- [ ] **Step 3: Implement PDF generator and report module**

```typescript
// backend/src/report/pdf-generator.service.ts
import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { AnalysisReport, isSectionError } from '../types/analysis.types';

@Injectable()
export class PdfGeneratorService {
  generate(report: AnalysisReport): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const chunks: Buffer[] = [];
      doc.on('data', (c) => chunks.push(c));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc.fontSize(22).text('AI Website Analyzer', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`URL: ${report.url}`);
      doc.text(`Analyzed: ${new Date(report.analyzedAt).toLocaleString()}`);
      doc.text(`Overall Grade: ${report.summary.grade}`);
      doc.moveDown();
      doc.fontSize(14).text('Summary');
      doc.fontSize(11).text(report.summary.overview);
      doc.moveDown();
      report.summary.recommendations.forEach((r, i) => {
        doc.text(`${i + 1}. [${r.priority}] ${r.message}`);
      });

      this.section(doc, 'SEO', () => {
        if (isSectionError(report.seo)) return doc.text(report.seo.error);
        doc.text(`Score: ${report.seo.score}`);
        report.seo.issues.forEach((i) => doc.text(`- ${i.message}`));
      });

      this.section(doc, 'Speed', () => {
        if (isSectionError(report.speed)) return doc.text(report.speed.error);
        doc.text(`Performance: ${report.speed.performanceScore}`);
        doc.text(`LCP: ${report.speed.lcp.value} | CLS: ${report.speed.cls.value} | INP: ${report.speed.inp.value}`);
      });

      this.section(doc, 'Security', () => {
        if (isSectionError(report.security)) return doc.text(report.security.error);
        doc.text(`Score: ${report.security.score}`);
        report.security.headers.forEach((h) => doc.text(`${h.name}: ${h.status}`));
      });

      this.section(doc, 'Tech Stack', () => {
        if (isSectionError(report.techStack)) return doc.text(report.techStack.error);
        report.techStack.technologies.forEach((t) => doc.text(`${t.name} (${t.category})`));
      });

      const pages = doc.bufferedPageRange();
      for (let i = 0; i < pages.count; i++) {
        doc.switchToPage(i);
        doc.fontSize(8).text(`Generated by AI Website Analyzer — Page ${i + 1}`, 50, doc.page.height - 40, { align: 'center' });
      }

      doc.end();
    });
  }

  private section(doc: PDFKit.PDFDocument, title: string, body: () => void) {
    doc.addPage();
    doc.fontSize(16).text(title);
    doc.moveDown(0.5);
    doc.fontSize(11);
    body();
  }
}
```

```typescript
// backend/src/report/report.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { AnalysisReport } from '../types/analysis.types';
import { PdfGeneratorService } from './pdf-generator.service';

@Injectable()
export class ReportService {
  constructor(private readonly pdf: PdfGeneratorService) {}

  validateReport(body: unknown): AnalysisReport {
    if (!body || typeof body !== 'object') throw new BadRequestException('Invalid report data');
    const r = body as AnalysisReport;
    if (!r.url || !r.summary || !r.analyzedAt) throw new BadRequestException('Invalid report data');
    return r;
  }

  async generatePdf(report: AnalysisReport): Promise<{ buffer: Buffer; filename: string }> {
    const buffer = await this.pdf.generate(report);
    const host = new URL(report.url).hostname.replace(/[^a-z0-9.-]/gi, '-');
    const date = report.analyzedAt.slice(0, 10);
    const filename = `website-analysis-${host}-${date}.pdf`;
    return { buffer, filename };
  }
}
```

```typescript
// backend/src/report/report.controller.ts
import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { ReportService } from './report.service';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post('pdf')
  async pdf(@Body() body: unknown, @Res() res: Response) {
    const report = this.reportService.validateReport(body);
    const { buffer, filename } = await this.reportService.generatePdf(report);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    });
    res.send(buffer);
  }
}
```

```typescript
// backend/src/report/report.module.ts
import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { PdfGeneratorService } from './pdf-generator.service';

@Module({
  controllers: [ReportController],
  providers: [ReportService, PdfGeneratorService],
})
export class ReportModule {}
```

- [ ] **Step 4: Run test — expect PASS**

```bash
cd backend && npm test -- pdf-generator.service.spec.ts
```

- [ ] **Step 5: Commit**

```bash
git add backend/src/report/ backend/test/pdf-generator.service.spec.ts
git commit -m "feat: add PDF report generation endpoint"
```

---

### Task 13: Wire AppModule and main.ts

**Files:**
- Modify: `backend/src/app.module.ts`
- Modify: `backend/src/main.ts`
- Create: `backend/.env.example`

- [ ] **Step 1: Update app.module.ts**

```typescript
import { Module } from '@nestjs/common';
import { AnalyzeModule } from './analyze/analyze.module';
import { ReportModule } from './report/report.module';

@Module({
  imports: [AnalyzeModule, ReportModule],
})
export class AppModule {}
```

- [ ] **Step 2: Update main.ts**

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors({ origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000' });
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
```

- [ ] **Step 3: Create .env.example**

```
PORT=3001
CORS_ORIGIN=http://localhost:3000
GOOGLE_PSI_API_KEY=your_key_here
SUMMARY_PROVIDER=rule-based
```

- [ ] **Step 4: Commit**

```bash
git add backend/src/app.module.ts backend/src/main.ts backend/.env.example
git commit -m "chore: wire modules and configure CORS/validation"
```

---

### Task 14: Backend e2e test

**Files:**
- Create: `backend/test/analyze.e2e-spec.ts`

- [ ] **Step 1: Write e2e test with mocked fetch**

```typescript
// backend/test/analyze.e2e-spec.ts
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpFetcherService } from '../src/fetcher/http-fetcher.service';
import { SpeedAnalyzer } from '../src/analyzers/speed.analyzer';

describe('Analyze (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(HttpFetcherService)
      .useValue({
        fetch: async () => ({
          html: '<html><head><title>Test</title><meta name="description" content="desc"></head><body><h1>Hi</h1></body></html>',
          headers: { 'x-frame-options': 'DENY' },
          finalUrl: 'https://example.com',
          statusCode: 200,
        }),
      })
      .overrideProvider(SpeedAnalyzer)
      .useValue({
        analyze: async () => ({
          performanceScore: 85,
          lcp: { value: '1.5s', pass: true },
          cls: { value: '0.05', pass: true },
          inp: { value: '100ms', pass: true },
          opportunities: [],
        }),
      })
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(() => app.close());

  it('POST /analyze returns report', () => {
    return request(app.getHttpServer())
      .post('/analyze')
      .send({ url: 'https://example.com' })
      .expect(201)
      .expect((res) => {
        expect(res.body.url).toBe('https://example.com');
        expect(res.body.summary.grade).toBeDefined();
      });
  });

  it('POST /report/pdf returns PDF', () => {
    const report = {
      url: 'https://example.com',
      analyzedAt: new Date().toISOString(),
      summary: { grade: 'B', overview: 'Test', recommendations: [] },
      seo: { score: 80, title: { present: true }, metaDescription: { present: true }, h1Count: 1, h1Texts: ['H'], openGraph: {}, images: { total: 0, withAlt: 0, withoutAlt: 0 }, issues: [] },
      security: { score: 50, headers: [], issues: [] },
      speed: { performanceScore: 70, lcp: { value: '2s', pass: true }, cls: { value: '0', pass: true }, inp: { value: '100ms', pass: true }, opportunities: [] },
      techStack: { technologies: [] },
    };
    return request(app.getHttpServer())
      .post('/report/pdf')
      .send(report)
      .expect(201)
      .expect('Content-Type', /pdf/)
      .expect((res) => expect(res.body.length).toBeGreaterThan(100));
  });
});
```

- [ ] **Step 2: Run e2e**

```bash
cd backend && npm run test:e2e
```

- [ ] **Step 3: Commit**

```bash
git add backend/test/analyze.e2e-spec.ts
git commit -m "test: add analyze and PDF e2e tests"
```

---

### Task 15: Scaffold Next.js frontend

**Files:**
- Create: `frontend/` (Next.js project)

- [ ] **Step 1: Create Next.js app**

```bash
npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir --no-import-alias --use-npm
```

- [ ] **Step 2: Create frontend types**

Copy `backend/src/types/analysis.types.ts` content into `frontend/src/types/analysis.ts` (same interfaces; frontend does not import from backend).

- [ ] **Step 3: Create .env.local.example**

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

- [ ] **Step 4: Commit**

```bash
git add frontend/
git commit -m "chore: scaffold Next.js frontend with shared types"
```

---

### Task 16: Frontend API client

**Files:**
- Create: `frontend/src/lib/api.ts`

- [ ] **Step 1: Implement API client**

```typescript
// frontend/src/lib/api.ts
import { AnalysisReport } from '@/types/analysis';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export async function analyzeUrl(url: string): Promise<AnalysisReport> {
  const res = await fetch(`${API_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? 'Analysis failed');
  }
  return res.json();
}

export async function downloadPdfReport(report: AnalysisReport): Promise<void> {
  const res = await fetch(`${API_URL}/report/pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(report),
  });
  if (!res.ok) throw new Error('Could not generate PDF. Please try again.');
  const blob = await res.blob();
  const disposition = res.headers.get('Content-Disposition') ?? '';
  const match = disposition.match(/filename="(.+)"/);
  const filename = match?.[1] ?? 'website-analysis.pdf';
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/lib/api.ts
git commit -m "feat: add frontend API client"
```

---

### Task 17: Frontend UI components

**Files:**
- Create: `frontend/src/components/ScoreBadge.tsx`
- Create: `frontend/src/components/UrlForm.tsx`
- Create: `frontend/src/components/SummaryCard.tsx`
- Create: `frontend/src/components/SeoCard.tsx`
- Create: `frontend/src/components/SpeedCard.tsx`
- Create: `frontend/src/components/SecurityCard.tsx`
- Create: `frontend/src/components/TechStackCard.tsx`
- Create: `frontend/src/components/DownloadPdfButton.tsx`

- [ ] **Step 1: Create ScoreBadge**

```tsx
// frontend/src/components/ScoreBadge.tsx
export function ScoreBadge({ score, label }: { score: number; label?: string }) {
  const color = score >= 80 ? 'text-green-400' : score >= 50 ? 'text-amber-400' : 'text-red-400';
  return (
    <span className={`text-2xl font-bold ${color}`}>
      {label ?? score}
    </span>
  );
}
```

- [ ] **Step 2: Create UrlForm**

```tsx
'use client';
// frontend/src/components/UrlForm.tsx
export function UrlForm({ onSubmit, loading }: { onSubmit: (url: string) => void; loading: boolean }) {
  return (
    <form
      className="flex gap-2 w-full max-w-2xl"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        onSubmit(String(fd.get('url') ?? ''));
      }}
    >
      <input
        name="url"
        type="url"
        required
        placeholder="https://example.com"
        className="flex-1 rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2 text-white"
      />
      <button type="submit" disabled={loading} className="rounded-lg bg-indigo-600 px-6 py-2 font-medium disabled:opacity-50">
        {loading ? 'Analyzing…' : 'Analyze'}
      </button>
    </form>
  );
}
```

- [ ] **Step 3: Create result cards** (SeoCard, SpeedCard, SecurityCard, TechStackCard, SummaryCard)

Each card: dark `bg-zinc-900 border border-zinc-800 rounded-xl p-4`. Use `isSectionError` helper (copy to frontend types file). Show score badge or error message. List issues with severity color.

- [ ] **Step 4: Create DownloadPdfButton**

```tsx
'use client';
// frontend/src/components/DownloadPdfButton.tsx
import { AnalysisReport } from '@/types/analysis';
import { downloadPdfReport } from '@/lib/api';

export function DownloadPdfButton({ report }: { report: AnalysisReport }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // useState import from react
  return (
    <div>
      <button
        onClick={async () => {
          setLoading(true);
          setError(null);
          try { await downloadPdfReport(report); }
          catch (e) { setError(e instanceof Error ? e.message : 'PDF failed'); }
          finally { setLoading(false); }
        }}
        disabled={loading}
        className="rounded-lg border border-zinc-600 px-4 py-2 text-sm hover:bg-zinc-800"
      >
        {loading ? 'Generating…' : 'Download PDF'}
      </button>
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/
git commit -m "feat: add results dashboard components"
```

---

### Task 18: Main page integration

**Files:**
- Modify: `frontend/src/app/page.tsx`
- Modify: `frontend/src/app/layout.tsx`
- Modify: `frontend/src/app/globals.css`

- [ ] **Step 1: Wire page.tsx**

```tsx
'use client';
// frontend/src/app/page.tsx
import { useState } from 'react';
import { analyzeUrl } from '@/lib/api';
import { AnalysisReport } from '@/types/analysis';
import { UrlForm } from '@/components/UrlForm';
import { SummaryCard } from '@/components/SummaryCard';
import { SeoCard } from '@/components/SeoCard';
import { SpeedCard } from '@/components/SpeedCard';
import { SecurityCard } from '@/components/SecurityCard';
import { TechStackCard } from '@/components/TechStackCard';
import { DownloadPdfButton } from '@/components/DownloadPdfButton';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<AnalysisReport | null>(null);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold">AI Website Analyzer</h1>
        <p className="text-zinc-400 mt-2">SEO, speed, security, and tech stack — in one report.</p>
      </header>
      <div className="flex justify-center mb-8">
        <UrlForm
          loading={loading}
          onSubmit={async (url) => {
            setLoading(true);
            setError(null);
            setReport(null);
            try {
              setReport(await analyzeUrl(url));
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Something went wrong');
            } finally {
              setLoading(false);
            }
          }}
        />
      </div>
      {loading && <p className="text-center text-zinc-400">Analyzing… speed checks can take up to 30 seconds</p>}
      {error && <p className="text-center text-red-400">{error}</p>}
      {report && (
        <section className="max-w-6xl mx-auto space-y-6">
          <div className="flex justify-between items-start">
            <SummaryCard report={report} />
            <DownloadPdfButton report={report} />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <SeoCard data={report.seo} />
            <SpeedCard data={report.speed} />
            <SecurityCard data={report.security} />
            <TechStackCard data={report.techStack} />
          </div>
        </section>
      )}
    </main>
  );
}
```

- [ ] **Step 2: Set dark body in layout.tsx** (`className="dark"` on html, `bg-zinc-950` on body)

- [ ] **Step 3: Manual smoke test**

```bash
# Terminal 1
cd backend && cp .env.example .env  # add real PSI key
npm run start:dev

# Terminal 2
cd frontend && cp .env.local.example .env.local
npm run dev
```

Open `http://localhost:3000`, analyze `https://example.com`, download PDF.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/app/
git commit -m "feat: integrate analysis dashboard on home page"
```

---

### Task 19: Root README and documentation

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Write complete README**

Include:
- Project description and screenshot placeholder
- Prerequisites: Node 18+, Google PSI API key
- Setup steps for backend and frontend
- Env var tables from spec
- Architecture diagram (mermaid or ASCII)
- Test commands: `npm test`, `npm run test:e2e`
- Future deployment notes (Vercel + Railway)

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add setup and architecture README"
```

---

## Spec Coverage Checklist

| Spec requirement | Task |
|------------------|------|
| Next.js + NestJS monorepo | 1, 15 |
| POST /analyze parallel analyzers | 4–11 |
| SEO analyzer | 5 |
| Security headers | 6 |
| Tech stack heuristics | 7 |
| PageSpeed Insights | 8 |
| Rule-based summary + LLM stubs | 9–10 |
| POST /report/pdf PDFKit | 12 |
| SSRF + URL validation | 3 |
| Frontend dashboard + PDF download | 16–18 |
| Dark theme UI | 17–18 |
| Unit + e2e tests | 3, 5–7, 9, 12, 14 |
| Env-based deploy readiness | 13, 15, 19 |
| No database | All tasks (stateless) |

## Self-Review

- No TBD/TODO placeholders in plan
- Types consistent across backend tasks and frontend Task 15
- `isSectionError` used uniformly
- PDF endpoint matches spec filename pattern
- All spec non-goals excluded from tasks
