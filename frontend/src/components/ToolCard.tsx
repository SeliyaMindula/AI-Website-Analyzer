import Link from 'next/link';
import type { ToolItem } from '@/lib/tools-config';

export function ToolCard({ href, title, description, icon: Icon }: ToolItem) {
  return (
    <Link
      href={href}
      className="group block wp-card p-6 hover:border-accent/50 hover:shadow-md transition-all"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent-soft text-accent mb-4 group-hover:opacity-90 transition-colors">
        <Icon className="h-5 w-5" strokeWidth={2} />
      </span>
      <h2 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors">{title}</h2>
      <p className="text-sm text-muted mt-2 leading-relaxed">{description}</p>
    </Link>
  );
}
