import { Module } from '@nestjs/common';
import { FetcherModule } from '../fetcher/fetcher.module';
import { UptimeController } from './uptime.controller';
import { UptimeService } from './uptime.service';

@Module({
  imports: [FetcherModule],
  controllers: [UptimeController],
  providers: [UptimeService],
})
export class UptimeModule {}
