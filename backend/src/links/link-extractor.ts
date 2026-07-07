import * as cheerio from 'cheerio';
import { LinkAssetType } from './links.types';

export interface ExtractedUrl {
  url: string;
  type: LinkAssetType;
}

const SKIP_PROTOCOLS = /^(mailto:|tel:|javascript:|data:|#)/i;
const NON_HTML_EXTENSIONS =
  /\.(css|js|mjs|json|xml|jpg|jpeg|png|gif|webp|svg|ico|woff2?|ttf|eot|pdf|zip|gz|mp4|webm|mp3|wav|avi)(\?|$)/i;

export function isSameHost(url: string, hostname: string): boolean {
  try {
    return new URL(url).hostname.toLowerCase() === hostname.toLowerCase();
  } catch {
    return false;
  }
}

export function isCrawlablePage(url: string): boolean {
  try {
    const { pathname } = new URL(url);
    if (pathname === '/' || !NON_HTML_EXTENSIONS.test(pathname)) return true;
    return /\.(html?|php|asp|aspx|jsp)(\?|$)/i.test(pathname);
  } catch {
    return false;
  }
}

function resolveUrl(href: string, baseUrl: string): string | null {
  const trimmed = href.trim();
  if (!trimmed || SKIP_PROTOCOLS.test(trimmed)) return null;
  try {
    return new URL(trimmed, baseUrl).href;
  } catch {
    return null;
  }
}

function parseSrcset(srcset: string, baseUrl: string): string[] {
  return srcset
    .split(',')
    .map((part) => part.trim().split(/\s+/)[0])
    .filter(Boolean)
    .map((part) => resolveUrl(part!, baseUrl))
    .filter((u): u is string => !!u);
}

export function extractUrls(html: string, pageUrl: string): ExtractedUrl[] {
  const $ = cheerio.load(html);
  const found: ExtractedUrl[] = [];

  const add = (href: string | undefined, type: LinkAssetType) => {
    if (!href) return;
    const url = resolveUrl(href, pageUrl);
    if (url) found.push({ url, type });
  };

  $('a[href]').each((_, el) => add($(el).attr('href'), 'link'));
  $('img[src]').each((_, el) => add($(el).attr('src'), 'image'));
  $('img[srcset]').each((_, el) => {
    const srcset = $(el).attr('srcset');
    if (!srcset) return;
    for (const url of parseSrcset(srcset, pageUrl)) {
      found.push({ url, type: 'image' });
    }
  });
  $('script[src]').each((_, el) => add($(el).attr('src'), 'script'));
  $('link[rel="stylesheet"][href]').each((_, el) => add($(el).attr('href'), 'stylesheet'));

  return found;
}
