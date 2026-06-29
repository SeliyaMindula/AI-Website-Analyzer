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
