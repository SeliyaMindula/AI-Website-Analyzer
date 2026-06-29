import { Module } from '@nestjs/common';
import { HttpFetcherService } from './http-fetcher.service';

@Module({
  providers: [HttpFetcherService],
  exports: [HttpFetcherService],
})
export class FetcherModule {}
