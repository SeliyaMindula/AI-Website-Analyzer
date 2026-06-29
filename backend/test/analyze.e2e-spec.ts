import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
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
