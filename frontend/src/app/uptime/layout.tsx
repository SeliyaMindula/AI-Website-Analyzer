import type { Metadata } from 'next';
import { ToolSeoBlurb } from '@/components/ToolSeoBlurb';
import { pageMetadata } from '@/lib/site-config';

export const metadata: Metadata = pageMetadata({
  title: 'Website Uptime Ping Test',
  description:
    'Check if a website is online and measure HTTP response time. Free uptime and availability checker.',
  path: '/uptime',
});

export default function UptimeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolSeoBlurb title="About this tool">
        Ping any URL to see if it is reachable and how fast it responds. A simple uptime check for
        monitoring landing pages, APIs, and production sites.
      </ToolSeoBlurb>
    </>
  );
}
