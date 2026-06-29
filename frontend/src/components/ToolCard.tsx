import Link from 'next/link';

const tools = [
  {
    href: '/analyze',
    title: 'Analyze Site',
    description: 'SEO, PageSpeed, security headers, tech stack, and PDF report.',
    icon: '🔍',
  },
  {
    href: '/internet-speed',
    title: 'Internet Speed',
    description: 'Test your connection — download, upload, ping, and jitter.',
    icon: '⚡',
  },
  {
    href: '/dns',
    title: 'DNS Lookup',
    description: 'View A, AAAA, MX, CNAME, NS, TXT, and SOA records.',
    icon: '🌐',
  },
  {
    href: '/ssl',
    title: 'SSL Check',
    description: 'Certificate validity, issuer, expiry, and TLS version.',
    icon: '🔒',
  },
  {
    href: '/uptime',
    title: 'Uptime Ping',
    description: 'Check if a site is reachable and how fast it responds.',
    icon: '📡',
  },
  {
    href: '/ip',
    title: 'IP / Geolocation',
    description: 'Resolve a domain or IP to location, ISP, and timezone.',
    icon: '📍',
  },
];

export function ToolCard({
  href,
  title,
  description,
  icon,
}: (typeof tools)[number]) {
  return (
    <Link
      href={href}
      className="group block bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-indigo-600/50 hover:bg-zinc-900/80 transition-all"
    >
      <span className="text-3xl mb-3 block">{icon}</span>
      <h2 className="text-lg font-semibold group-hover:text-indigo-400 transition-colors">{title}</h2>
      <p className="text-sm text-zinc-400 mt-2 leading-relaxed">{description}</p>
    </Link>
  );
}

export { tools };
