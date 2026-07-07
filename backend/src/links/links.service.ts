import { Injectable } from '@nestjs/common';
import { assertPublicUrl } from '../common/ssrf-guard';
import { validateUrl } from '../common/url-validator';
import { HttpFetcherService } from '../fetcher/http-fetcher.service';
import { extractUrls, isCrawlablePage, isSameHost } from './link-extractor';
import { BrokenLinkEntry, BrokenLinksResult, CrawledPage, LimitReason, LinkAssetType } from './links.types';
import { checkUrlsConcurrently } from './url-checker';

const MAX_PAGES = 50;
const MAX_LINKS = 250;
const MAX_DURATION_MS = 60_000;
const CHECK_CONCURRENCY = 5;

@Injectable()
export class LinksService {
  constructor(private readonly fetcher: HttpFetcherService) {}

  async check(startUrlInput: string): Promise<BrokenLinksResult> {
    const startUrl = validateUrl(startUrlInput);
    assertPublicUrl(startUrl);
    const hostname = new URL(startUrl).hostname.toLowerCase();
    const deadline = Date.now() + MAX_DURATION_MS;

    const pageQueue: string[] = [startUrl];
    const queuedPages = new Set<string>([startUrl]);
    const visitedPages = new Set<string>();
    const urlMeta = new Map<string, { type: LinkAssetType; foundOn: Set<string> }>();
    const pages: CrawledPage[] = [];

    let limitReached = false;
    let limitReason: LimitReason | undefined;

    const isExpired = () => Date.now() >= deadline;

    while (pageQueue.length > 0 && visitedPages.size < MAX_PAGES && !isExpired()) {
      const pageUrl = pageQueue.shift()!;
      queuedPages.delete(pageUrl);
      if (visitedPages.has(pageUrl)) continue;
      visitedPages.add(pageUrl);

      let html = '';
      let statusCode = 0;
      try {
        const result = await this.fetcher.fetch(pageUrl);
        html = result.html;
        statusCode = result.statusCode;
      } catch {
        pages.push({ url: pageUrl, statusCode: 0, linkCount: 0 });
        continue;
      }

      const extracted = extractUrls(html, pageUrl);
      pages.push({ url: pageUrl, statusCode, linkCount: extracted.length });

      for (const { url, type } of extracted) {
        if (!urlMeta.has(url) && urlMeta.size >= MAX_LINKS) {
          limitReached = true;
          limitReason = 'links';
          break;
        }

        let meta = urlMeta.get(url);
        if (!meta) {
          meta = { type, foundOn: new Set() };
          urlMeta.set(url, meta);
        }
        meta.foundOn.add(pageUrl);

        if (
          isSameHost(url, hostname) &&
          isCrawlablePage(url) &&
          !visitedPages.has(url) &&
          !queuedPages.has(url)
        ) {
          pageQueue.push(url);
          queuedPages.add(url);
        }
      }

      if (limitReason === 'links') break;
    }

    if (!limitReason && visitedPages.size >= MAX_PAGES && pageQueue.length > 0) {
      limitReached = true;
      limitReason = 'pages';
    }
    if (!limitReason && isExpired()) {
      limitReached = true;
      limitReason = 'timeout';
    }

    const urlsToCheck = [...urlMeta.keys()].slice(0, MAX_LINKS);
    const outcomes = await checkUrlsConcurrently(urlsToCheck, CHECK_CONCURRENCY, isExpired);

    const broken: BrokenLinkEntry[] = [];
    let okCount = 0;

    for (const url of urlsToCheck) {
      const outcome = outcomes.get(url);
      const meta = urlMeta.get(url)!;
      if (outcome?.ok) {
        okCount++;
        continue;
      }
      broken.push({
        url,
        statusCode: outcome?.statusCode ?? null,
        error: outcome?.error,
        foundOn: [...meta.foundOn],
        type: meta.type,
      });
    }

    return {
      startUrl,
      hostname,
      pagesCrawled: pages.length,
      linksChecked: urlsToCheck.length,
      brokenCount: broken.length,
      okCount,
      limitReached,
      limitReason,
      checkedAt: new Date().toISOString(),
      broken,
      pages,
    };
  }
}
