export type LinkAssetType = 'link' | 'image' | 'script' | 'stylesheet';

export type LimitReason = 'pages' | 'links' | 'timeout';

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
  limitReason?: LimitReason;
  checkedAt: string;
  broken: BrokenLinkEntry[];
  pages: CrawledPage[];
}
