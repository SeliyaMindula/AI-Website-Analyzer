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
