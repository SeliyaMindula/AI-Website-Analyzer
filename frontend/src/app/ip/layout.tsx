import type { Metadata } from 'next';
import { ToolSeoBlurb } from '@/components/ToolSeoBlurb';
import { pageMetadata } from '@/lib/site-config';

export const metadata: Metadata = pageMetadata({
  title: 'IP Geolocation Lookup',
  description:
    'Resolve a domain or IP address to location, ISP, timezone, and coordinates. Free IP geolocation tool.',
  path: '/ip',
});

export default function IpLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolSeoBlurb title="About this tool">
        Look up geolocation and network details for any IP address or domain. Find country, region,
        ISP, timezone, and coordinates for troubleshooting and analytics.
      </ToolSeoBlurb>
    </>
  );
}
