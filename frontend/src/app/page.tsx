import { ToolCard, tools } from '@/components/ToolCard';

export default function HubPage() {
  return (
    <main className="flex-1 p-8">
      <div className="text-center mb-12 max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          WebPulse <span className="text-accent">AI</span>
        </h1>
        <p className="text-muted mt-3 text-lg">Pulse-check the web — sites, speed, DNS, SSL &amp; uptime.</p>
      </div>
      <div className="max-w-4xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <ToolCard key={tool.href} {...tool} />
        ))}
      </div>
    </main>
  );
}
