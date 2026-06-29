import { Module } from '@nestjs/common';
import { AnalyzeController } from './analyze.controller';
import { AnalyzeService } from './analyze.service';
import { FetcherModule } from '../fetcher/fetcher.module';
import { AnalyzersModule } from '../analyzers/analyzers.module';
import { SummaryModule } from '../summary/summary.module';

@Module({
  imports: [FetcherModule, AnalyzersModule, SummaryModule],
  controllers: [AnalyzeController],
  providers: [AnalyzeService],
})
export class AnalyzeModule {}
