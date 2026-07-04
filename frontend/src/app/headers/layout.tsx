import type { Metadata } from 'next';
import { ToolSeoBlurb } from '@/components/ToolSeoBlurb';
import { pageMetadata } from '@/lib/site-config';

export const metadata: Metadata = pageMetadata({
  title: 'HTTP Headers Checker',
  description:
    'Inspect HTTP response headers for any URL — status code, security headers, cache control, and server info.',
  path: '/headers',
});

export default function HeadersLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolSeoBlurb title="About this tool">
        Fetch and display HTTP response headers from any public URL. Useful for debugging
        security headers, caching, redirects, and server configuration.
      </ToolSeoBlurb>
    </>
  );
}
