import { Injectable } from '@nestjs/common';
import { FetchResult, Issue, SecurityHeaderCheck, SecurityResult } from '../types/analysis.types';

const SECURITY_HEADERS = [
  { name: 'Content-Security-Policy', key: 'content-security-policy' },
  { name: 'Strict-Transport-Security', key: 'strict-transport-security' },
  { name: 'X-Frame-Options', key: 'x-frame-options' },
  { name: 'X-Content-Type-Options', key: 'x-content-type-options' },
  { name: 'Referrer-Policy', key: 'referrer-policy' },
  { name: 'Permissions-Policy', key: 'permissions-policy' },
] as const;

@Injectable()
export class SecurityAnalyzer {
  analyze(fetch: FetchResult): SecurityResult {
    const issues: Issue[] = [];
    const headers: SecurityHeaderCheck[] = SECURITY_HEADERS.map(({ name, key }) => {
      const value = fetch.headers[key];
      const status = value ? 'present' : 'missing';
      if (!value) issues.push({ severity: 'warning', message: `Missing ${name} header` });
      return { name, status, value };
    });

    const presentCount = headers.filter((h) => h.status === 'present').length;
    const score = Math.round((presentCount / headers.length) * 100);

    return { score, headers, issues };
  }
}
