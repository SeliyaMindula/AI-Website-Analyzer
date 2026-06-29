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
    expect(summary.overview).toContain('SEO:');
    expect(summary.overview).toContain('Security:');
    expect(summary.overview).toContain('Speed:');
    expect(summary.recommendations.length).toBeGreaterThan(0);
  });
});
