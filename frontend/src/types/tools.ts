export interface DnsLookupResult {
  domain: string;
  records: { type: string; values: string[] }[];
  queriedAt: string;
}

export interface SslCheckResult {
  domain: string;
  valid: boolean;
  issuer: string;
  subject: string;
  validFrom: string;
  validTo: string;
  daysRemaining: number;
  protocol: string;
  altNames: string[];
  checkedAt: string;
}

export interface UptimeCheckResult {
  url: string;
  finalUrl: string;
  up: boolean;
  statusCode: number;
  responseTimeMs: number;
  checkedAt: string;
}

export interface HeadersCheckResult {
  url: string;
  finalUrl: string;
  statusCode: number;
  headers: { name: string; value: string }[];
  checkedAt: string;
}

export interface IpLookupResult {
  query: string;
  ip: string;
  resolvedFrom?: string;
  country: string;
  countryCode: string;
  region: string;
  city: string;
  isp: string;
  latitude: number | null;
  longitude: number | null;
  timezone: string;
  lookedUpAt: string;
}

export type LinkAssetType = 'link' | 'image' | 'script' | 'stylesheet';

export interface BrokenLinkEntry {
  url: string;
  statusCode: number | null;
  error?: string;
  foundOn: string[];
  type: LinkAssetType;
}

export interface CrawledPage {
  url: string;
  statusCode: number;
  linkCount: number;
}

export interface BrokenLinksResult {
  startUrl: string;
  hostname: string;
  pagesCrawled: number;
  linksChecked: number;
  brokenCount: number;
  okCount: number;
  limitReached: boolean;
  limitReason?: 'pages' | 'links' | 'timeout';
  checkedAt: string;
  broken: BrokenLinkEntry[];
  pages: CrawledPage[];
}
