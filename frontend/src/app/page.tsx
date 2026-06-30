import type { Metadata } from 'next';
import { ToolCard, tools } from '@/components/ToolCard';
import { pageMetadata } from '@/lib/site-config';

export const metadata: Metadata = pageMetadata({
  title: 'Free Website Diagnostics Tools',
  description:
    'Pulse-check the web with free online tools — website SEO analysis, internet speed tests, DNS lookup, SSL checks, uptime monitoring, and IP geolocation.',
});

export default function HubPage() {
  return (
    <main className="flex-1 p-8">
      <div className="text-center mb-12 max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          WebPulses <span className="text-accent">AI</span>
        </h1>
        <p className="text-muted mt-3 text-lg">
          Free online tools to analyze websites, test internet speed, look up DNS records,
          verify SSL certificates, check uptime, and find IP geolocation.
        </p>
      </div>
      <div className="max-w-4xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <ToolCard key={tool.href} {...tool} />
        ))}
      </div>
    </main>
  );
}
