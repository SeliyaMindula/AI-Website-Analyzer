import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/site-config';

export const metadata: Metadata = pageMetadata({
  title: 'Internet Speed Test',
  description:
    'Test your internet connection speed — live download, upload, ping, and jitter measurements with a speedometer.',
  path: '/internet-speed',
});

export default function InternetSpeedLayout({ children }: { children: React.ReactNode }) {
  return children;
}
