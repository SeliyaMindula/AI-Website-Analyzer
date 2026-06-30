import type { Metadata } from 'next';

export const SITE_NAME = 'WebPulse AI';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.webpulsesai.com';
export const SITE_DESCRIPTION =
  'Free online tools for website SEO analysis, internet speed tests, DNS lookup, SSL checks, uptime monitoring, and IP geolocation.';

export const SITE_KEYWORDS = [
  'website analyzer',
  'SEO checker',
  'PageSpeed test',
  'DNS lookup',
  'SSL certificate check',
  'uptime monitor',
  'IP geolocation',
  'internet speed test',
];

export function pageMetadata({
  title,
  description,
  path = '',
}: {
  title: string;
  description: string;
  path?: string;
}): Metadata {
  const url = path ? `${SITE_URL}${path}` : SITE_URL;

  return {
    title,
    description,
    keywords: SITE_KEYWORDS,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_NAME}`,
      description,
    },
  };
}

export const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
    },
    {
      '@type': 'WebApplication',
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Any',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
  ],
};

export const ROUTES = [
  { path: '/', priority: 1, changeFrequency: 'weekly' as const },
  { path: '/analyze', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/internet-speed', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/dns', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/ssl', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/uptime', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/ip', priority: 0.9, changeFrequency: 'weekly' as const },
];
