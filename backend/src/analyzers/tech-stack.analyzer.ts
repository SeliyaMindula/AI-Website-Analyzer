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
  {
    name: 'Next.js',
    category: 'Framework',
    test: (f) => /_next\//i.test(f.html) || /next\.js/i.test(f.headers['x-powered-by'] ?? ''),
  },
  {
    name: 'React',
    category: 'Framework',
    test: (f) => /react/i.test(f.html) || /__NEXT_DATA__/i.test(f.html),
  },
  { name: 'Vue', category: 'Framework', test: (f) => /vue/i.test(f.html) },
  { name: 'Angular', category: 'Framework', test: (f) => /ng-version/i.test(f.html) },
  {
    name: 'Cloudflare',
    category: 'CDN',
    test: (f) => /cloudflare/i.test(f.headers['server'] ?? ''),
  },
  {
    name: 'Google Analytics',
    category: 'Analytics',
    test: (f) => /google-analytics\.com|gtag\(/i.test(f.html),
  },
  {
    name: 'Google Tag Manager',
    category: 'Analytics',
    test: (f) => /googletagmanager\.com/i.test(f.html),
  },
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
