import { Injectable } from '@nestjs/common';
import { HttpFetcherService } from '../fetcher/http-fetcher.service';

@Injectable()
export class HeadersService {
  constructor(private readonly fetcher: HttpFetcherService) {}

  async check(url: string) {
    const result = await this.fetcher.fetch(url);
    const headers = Object.entries(result.headers)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return {
      url,
      finalUrl: result.finalUrl,
      statusCode: result.statusCode,
      headers,
      checkedAt: new Date().toISOString(),
    };
  }
}
