import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/site-config';

export const metadata: Metadata = pageMetadata({
  title: 'SSL Certificate Checker',
  description:
    'Check SSL/TLS certificate validity, issuer, expiry date, alternate names, and protocol version for any domain.',
  path: '/ssl',
});

export default function SslLayout({ children }: { children: React.ReactNode }) {
  return children;
}
