import { Injectable, BadRequestException, GatewayTimeoutException } from '@nestjs/common';
import { FetchResult } from '../types/analysis.types';
import { validateUrl } from '../common/url-validator';
import { assertPublicUrl } from '../common/ssrf-guard';

const TIMEOUT_MS = 10_000;
const MAX_REDIRECTS = 5;

@Injectable()
export class HttpFetcherService {
  async fetch(urlInput: string): Promise<FetchResult> {
    let currentUrl = validateUrl(urlInput);
    assertPublicUrl(currentUrl);
    let redirects = 0;
    while (redirects <= MAX_REDIRECTS) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
      try {
        const response = await fetch(currentUrl, {
          signal: controller.signal,
          redirect: 'manual',
          headers: { 'User-Agent': 'WebPulses-AI/1.0' },
        });
        clearTimeout(timer);
        if (response.status >= 300 && response.status < 400) {
          const location = response.headers.get('location');
          if (!location) break;
          currentUrl = new URL(location, currentUrl).href;
          assertPublicUrl(currentUrl);
          redirects++;
          continue;
        }
        const html = await response.text();
        const headers: Record<string, string> = {};
        response.headers.forEach((value, key) => { headers[key.toLowerCase()] = value; });
        return { html, headers, finalUrl: currentUrl, statusCode: response.status };
      } catch (err) {
        clearTimeout(timer);
        if (err instanceof Error && err.name === 'AbortError') {
          throw new GatewayTimeoutException('Could not reach website in time');
        }
        if (err instanceof BadRequestException) throw err;
        throw new BadRequestException('Could not reach website');
      }
    }
    throw new BadRequestException('Too many redirects');
  }
}
