import type { Metadata } from 'next';
import { ToolSeoBlurb } from '@/components/ToolSeoBlurb';
import { pageMetadata } from '@/lib/site-config';

export const metadata: Metadata = pageMetadata({
  title: 'Broken Link Checker',
  description:
    'Crawl a website and find broken links, images, scripts, and stylesheets. Same-domain scan with up to 50 pages.',
  path: '/broken-links',
});

export default function BrokenLinksLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolSeoBlurb title="About this tool">
        Enter your site URL and we crawl internal pages (same domain only), extract every link,
        image, script, and stylesheet, then check each one for 404s and other errors. Great for
        SEO audits and pre-launch checks.
      </ToolSeoBlurb>
    </>
  );
}
