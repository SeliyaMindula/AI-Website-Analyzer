import Link from 'next/link';
import { diagnosticsTools, imageTools } from '@/lib/tools-config';

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-surface/50">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <div className="grid sm:grid-cols-2 gap-6">
          <nav aria-label="Website tools">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-3">
              Website & Network
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {diagnosticsTools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="text-sm text-muted hover:text-accent transition-colors"
                >
                  {tool.title}
                </Link>
              ))}
            </div>
          </nav>
          <nav aria-label="Image tools">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-3">Image Tools</p>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {imageTools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="text-sm text-muted hover:text-accent transition-colors"
                >
                  {tool.title}
                </Link>
              ))}
            </div>
          </nav>
        </div>
        <p className="text-center text-xs text-muted">
          © {new Date().getFullYear()} WebPulses AI — free website & image tools.
        </p>
      </div>
    </footer>
  );
}
