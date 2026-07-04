import type { Metadata } from 'next';
import { ToolGroupSection } from '@/components/ToolGroupSection';
import { pageMetadata } from '@/lib/site-config';
import { toolGroups } from '@/lib/tools-config';

export const metadata: Metadata = pageMetadata({
  title: 'Free Website Diagnostics Tools',
  description:
    'Free online tools — website SEO analysis, HTTP headers, DNS, SSL, uptime, IP lookup, and image editing (background removal, compress, resize, convert).',
});

export default function HubPage() {
  return (
    <main className="flex-1 p-8">
      <div className="text-center mb-12 max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          WebPulses <span className="text-accent">AI</span>
        </h1>
        <p className="text-muted mt-3 text-lg">
          Free online tools for website diagnostics and image editing — no signup, private, and fast.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-16">
        {toolGroups.map((group) => (
          <ToolGroupSection key={group.id} group={group} />
        ))}
      </div>

      <section className="max-w-2xl mx-auto mt-16 text-center px-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted mb-2">
          Why WebPulses AI
        </h2>
        <p className="text-sm text-muted leading-relaxed">
          Website checks run via our API. Image tools run entirely in your browser — your files stay
          on your device. Built for developers, creators, and anyone who needs reliable tools in seconds.
        </p>
      </section>
    </main>
  );
}
