import { BadRequestException, Injectable } from '@nestjs/common';
import * as dns from 'dns/promises';
import { normalizeDomain } from '../common/domain-validator';

@Injectable()
export class DnsService {
  async lookup(domainInput: string) {
    let domain: string;
    try {
      domain = normalizeDomain(domainInput);
    } catch {
      throw new BadRequestException('Please enter a valid domain');
    }

    const queries: Array<{ type: string; fn: () => Promise<unknown> }> = [
      { type: 'A', fn: () => dns.resolve4(domain) },
      { type: 'AAAA', fn: () => dns.resolve6(domain) },
      { type: 'MX', fn: () => dns.resolveMx(domain) },
      { type: 'CNAME', fn: () => dns.resolveCname(domain) },
      { type: 'NS', fn: () => dns.resolveNs(domain) },
      { type: 'TXT', fn: () => dns.resolveTxt(domain) },
      { type: 'SOA', fn: () => dns.resolveSoa(domain) },
    ];

    const records: { type: string; values: string[] }[] = [];

    for (const q of queries) {
      try {
        const result = await q.fn();
        records.push({ type: q.type, values: this.formatValues(q.type, result) });
      } catch (err) {
        const code = (err as NodeJS.ErrnoException).code;
        if (code === 'ENODATA' || code === 'ENOTFOUND') continue;
        throw err;
      }
    }

    return { domain, records, queriedAt: new Date().toISOString() };
  }

  private formatValues(type: string, result: unknown): string[] {
    if (type === 'MX' && Array.isArray(result)) {
      return result.map((r) => `${r.priority} ${r.exchange}`);
    }
    if (type === 'TXT' && Array.isArray(result)) {
      return result.map((chunks) => (Array.isArray(chunks) ? chunks.join('') : String(chunks)));
    }
    if (type === 'SOA' && result && typeof result === 'object') {
      const soa = result as { nsname: string; hostmaster: string; serial: number };
      return [`nsname=${soa.nsname} hostmaster=${soa.hostmaster} serial=${soa.serial}`];
    }
    if (Array.isArray(result)) return result.map(String);
    return [String(result)];
  }
}
