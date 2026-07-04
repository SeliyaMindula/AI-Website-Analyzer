import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  Eraser,
  FileCode2,
  FileImage,
  Globe,
  MapPin,
  Maximize2,
  ScanSearch,
  ShieldCheck,
  Shrink,
} from 'lucide-react';

export type ToolItem = {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export type ToolGroup = {
  id: string;
  title: string;
  description: string;
  tools: ToolItem[];
};

export const diagnosticsTools: ToolItem[] = [
  {
    href: '/analyze',
    title: 'Analyze Site',
    description: 'SEO, PageSpeed, security headers, tech stack, and PDF report.',
    icon: ScanSearch,
  },
  {
    href: '/headers',
    title: 'HTTP Headers',
    description: 'Inspect response headers — security, cache, server, and more.',
    icon: FileCode2,
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

export const imageTools: ToolItem[] = [
  {
    href: '/image/remove-background',
    title: 'Remove Background',
    description: 'AI-powered background removal — runs privately in your browser.',
    icon: Eraser,
  },
  {
    href: '/image/compress',
    title: 'Compress Image',
    description: 'Reduce file size with adjustable quality — JPG, PNG, or WebP.',
    icon: Shrink,
  },
  {
    href: '/image/resize',
    title: 'Resize Image',
    description: 'Scale images to exact width and height with aspect ratio lock.',
    icon: Maximize2,
  },
  {
    href: '/image/convert',
    title: 'Convert Format',
    description: 'Convert between PNG, JPG, and WebP in one click.',
    icon: FileImage,
  },
];

export const toolGroups: ToolGroup[] = [
  {
    id: 'diagnostics',
    title: 'Website & Network Tools',
    description: 'Analyze sites, check DNS, SSL, uptime, headers, and IP geolocation.',
    tools: diagnosticsTools,
  },
  {
    id: 'image',
    title: 'Image Tools',
    description: 'Edit images in your browser — no upload to our servers, private and free.',
    tools: imageTools,
  },
];

export const allTools: ToolItem[] = [...diagnosticsTools, ...imageTools];
