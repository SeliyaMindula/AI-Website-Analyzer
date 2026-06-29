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
