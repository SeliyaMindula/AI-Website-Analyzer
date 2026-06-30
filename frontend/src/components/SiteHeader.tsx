'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export function SiteHeader() {
  const pathname = usePathname();
  const onHub = pathname === '/';

  return (
    <header className="border-b border-border bg-surface/95 backdrop-blur sticky top-0 z-10 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground hover:text-accent transition-colors">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-soft text-accent">
            <Activity className="h-4 w-4" strokeWidth={2.5} />
          </span>
          WebPulse <span className="text-accent">AI</span>
        </Link>
        <div className="flex items-center gap-3">
          {!onHub && (
            <Link href="/" className="text-sm text-muted hover:text-accent transition-colors">
              ← All tools
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
