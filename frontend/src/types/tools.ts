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

export interface InternetSpeedResult {
  downloadMbps: number;
  uploadMbps: number;
  pingMs: number;
  jitterMs: number;
  testedAt: string;
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
