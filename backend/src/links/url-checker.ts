import { assertPublicUrl } from '../common/ssrf-guard';

const CHECK_TIMEOUT_MS = 8_000;
const USER_AGENT = 'WebPulses-AI/1.0';

export interface UrlCheckOutcome {
  ok: boolean;
  statusCode: number | null;
  error?: string;
}

export async function checkUrl(url: string): Promise<UrlCheckOutcome> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CHECK_TIMEOUT_MS);

  try {
    assertPublicUrl(url);
    let response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'User-Agent': USER_AGENT },
    });

    if (response.status === 405 || response.status === 501) {
      response = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
        redirect: 'follow',
        headers: { 'User-Agent': USER_AGENT },
      });
    }

    clearTimeout(timer);
    const ok = response.status >= 200 && response.status < 400;
    return { ok, statusCode: response.status };
  } catch (err) {
    clearTimeout(timer);
    if (err instanceof Error && err.message.includes('private')) {
      return { ok: false, statusCode: null, error: err.message };
    }
    const error =
      err instanceof Error && err.name === 'AbortError' ? 'Timeout' : 'Request failed';
    return { ok: false, statusCode: null, error };
  }
}

export async function checkUrlsConcurrently(
  urls: string[],
  concurrency: number,
  isExpired: () => boolean,
): Promise<Map<string, UrlCheckOutcome>> {
  const results = new Map<string, UrlCheckOutcome>();
  let index = 0;

  async function worker() {
    while (index < urls.length && !isExpired()) {
      const current = urls[index++];
      results.set(current, await checkUrl(current));
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, urls.length) }, () => worker()));
  return results;
}
