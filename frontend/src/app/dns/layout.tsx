import type { Metadata } from 'next';
import { ToolSeoBlurb } from '@/components/ToolSeoBlurb';
import { pageMetadata } from '@/lib/site-config';

export const metadata: Metadata = pageMetadata({
  title: 'DNS Lookup Tool',
  description:
    'Look up DNS records for any domain — A, AAAA, MX, CNAME, NS, TXT, and SOA records instantly.',
  path: '/dns',
});

export default function DnsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolSeoBlurb title="About this tool">
        Query public DNS records for any domain name. Useful for verifying mail servers, CDN setup,
        domain transfers, and troubleshooting connectivity issues.
      </ToolSeoBlurb>
    </>
  );
}
