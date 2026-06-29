'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function SiteHeader() {
  const pathname = usePathname();
  const onHub = pathname === '/';

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="text-xl font-bold tracking-tight hover:text-indigo-400 transition-colors">
          WebPulse <span className="text-indigo-400">AI</span>
        </Link>
        {!onHub && (
          <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">
            ← All tools
          </Link>
        )}
      </div>
    </header>
  );
}
