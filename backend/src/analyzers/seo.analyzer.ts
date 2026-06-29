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
