import { isIP, isIPv6 } from 'net';
import { normalizeDomain } from './domain-validator';

export function parseIpOrDomain(input: string): { type: 'ip'; ip: string } | { type: 'domain'; domain: string } {
  const trimmed = input.trim();
  if (isIP(trimmed)) {
    if (isPrivateIp(trimmed)) {
      throw new Error('Cannot look up private or local IP addresses');
    }
    return { type: 'ip', ip: trimmed };
  }
  return { type: 'domain', domain: normalizeDomain(trimmed) };
}

function isPrivateIp(ip: string): boolean {
  if (isIPv6(ip)) {
    return ip === '::1' || ip.startsWith('fc') || ip.startsWith('fd') || ip.startsWith('fe80');
  }
  const parts = ip.split('.').map(Number);
  const [a, b] = parts;
  if (a === 10 || a === 127) return true;
  if (a === 192 && b === 168) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  return false;
}
