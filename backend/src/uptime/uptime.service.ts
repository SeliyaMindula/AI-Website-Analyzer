import { Injectable } from '@nestjs/common';
import { HttpFetcherService } from '../fetcher/http-fetcher.service';

@Injectable()
export class UptimeService {
  constructor(private readonly fetcher: HttpFetcherService) {}

  async check(url: string) {
    const start = performance.now();
    const result = await this.fetcher.fetch(url);
    const responseTimeMs = Math.round(performance.now() - start);

    return {
      url,
      finalUrl: result.finalUrl,
      up: result.statusCode < 500,
      statusCode: result.statusCode,
      responseTimeMs,
      checkedAt: new Date().toISOString(),
    };
  }
}
