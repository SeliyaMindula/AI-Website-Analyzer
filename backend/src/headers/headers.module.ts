import { Module } from '@nestjs/common';
import { FetcherModule } from '../fetcher/fetcher.module';
import { HeadersController } from './headers.controller';
import { HeadersService } from './headers.service';

@Module({
  imports: [FetcherModule],
  controllers: [HeadersController],
  providers: [HeadersService],
})
export class HeadersModule {}
