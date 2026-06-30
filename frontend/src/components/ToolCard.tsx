import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  Globe,
  MapPin,
  ScanSearch,
  ShieldCheck,
  Zap,
} from 'lucide-react';

const tools: {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    href: '/analyze',
    title: 'Analyze Site',
    description: 'SEO, PageSpeed, security headers, tech stack, and PDF report.',
    icon: ScanSearch,
  },
  {
    href: '/internet-speed',
    title: 'Internet Speed',
    description: 'Test your connection — download, upload, ping, and jitter.',
    icon: Zap,
  },
  {
    href: '/dns',
    title: 'DNS Lookup',
    description: 'View A, AAAA, MX, CNAME, NS, TXT, and SOA records.',
    icon: Globe,
  },
  {
    href: '/ssl',
    title: 'SSL Check',
    description: 'Certificate validity, issuer, expiry, and TLS version.',
    icon: ShieldCheck,
  },
  {
    href: '/uptime',
    title: 'Uptime Ping',
    description: 'Check if a site is reachable and how fast it responds.',
    icon: Activity,
  },
  {
    href: '/ip',
    title: 'IP / Geolocation',
    description: 'Resolve a domain or IP to location, ISP, and timezone.',
    icon: MapPin,
  },
];

export function ToolCard({
  href,
  title,
  description,
  icon: Icon,
}: (typeof tools)[number]) {
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

export { tools };
