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
