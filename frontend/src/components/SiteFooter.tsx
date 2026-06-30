import Link from 'next/link';
import { tools } from '@/components/ToolCard';

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-surface/50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <nav aria-label="Tools" className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="text-sm text-muted hover:text-accent transition-colors"
            >
              {tool.title}
            </Link>
          ))}
        </nav>
        <p className="text-center text-xs text-muted mt-6">
          © {new Date().getFullYear()} WebPulse AI — free website diagnostics tools.
        </p>
      </div>
    </footer>
  );
}
