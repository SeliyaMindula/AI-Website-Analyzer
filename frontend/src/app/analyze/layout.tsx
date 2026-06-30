import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/site-config';

export const metadata: Metadata = pageMetadata({
  title: 'Website SEO & Speed Analyzer',
  description:
    'Analyze any website for SEO score, Google PageSpeed, security headers, and tech stack. Download a PDF report.',
  path: '/analyze',
});

export default function AnalyzeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
