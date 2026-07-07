import { Module } from '@nestjs/common';
import { FetcherModule } from '../fetcher/fetcher.module';
import { LinksController } from './links.controller';
import { LinksService } from './links.service';

@Module({
  imports: [FetcherModule],
  controllers: [LinksController],
  providers: [LinksService],
})
export class LinksModule {}
