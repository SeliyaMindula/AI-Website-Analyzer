import { URL } from 'url';

const BLOCKED_HOSTNAMES = new Set(['localhost', '0.0.0.0']);

function isPrivateIpv4(host: string): boolean {
  const match = host.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  if (!match) return false;
  const [, a, b] = match.map(Number);
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 192 && b === 168) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  return false;
}

export function assertPublicUrl(url: string): void {
  const { hostname } = new URL(url);
  const host = hostname.toLowerCase();
  if (BLOCKED_HOSTNAMES.has(host) || host.endsWith('.local')) {
    throw new Error('Cannot analyze local or private addresses');
  }
  if (isPrivateIpv4(host)) {
    throw new Error('Cannot analyze local or private addresses');
  }
}
