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
