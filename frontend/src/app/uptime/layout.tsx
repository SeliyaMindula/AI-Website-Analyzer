import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/site-config';

export const metadata: Metadata = pageMetadata({
  title: 'Website Uptime Ping Test',
  description:
    'Check if a website is online and measure HTTP response time. Free uptime and availability checker.',
  path: '/uptime',
});

export default function UptimeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
