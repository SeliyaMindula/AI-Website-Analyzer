import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/site-config';

export const metadata: Metadata = pageMetadata({
  title: 'DNS Lookup Tool',
  description:
    'Look up DNS records for any domain — A, AAAA, MX, CNAME, NS, TXT, and SOA records instantly.',
  path: '/dns',
});

export default function DnsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
