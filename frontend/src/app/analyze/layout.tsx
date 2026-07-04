import type { Metadata } from 'next';
import { ToolSeoBlurb } from '@/components/ToolSeoBlurb';
import { pageMetadata } from '@/lib/site-config';

export const metadata: Metadata = pageMetadata({
  title: 'Website SEO & Speed Analyzer',
  description:
    'Analyze any website for SEO score, Google PageSpeed, security headers, and tech stack. Download a PDF report.',
  path: '/analyze',
});

export default function AnalyzeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolSeoBlurb title="About this tool">
        Run a full website audit in one click — SEO tags, mobile PageSpeed, HTTP security headers,
        and detected technologies. Ideal for developers, marketers, and site owners who need a quick
        health check before launch or after changes.
      </ToolSeoBlurb>
    </>
  );
}
