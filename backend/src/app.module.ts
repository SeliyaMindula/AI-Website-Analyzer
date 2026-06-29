import { Module } from '@nestjs/common';
import { AnalyzeModule } from './analyze/analyze.module';
import { ReportModule } from './report/report.module';

@Module({
  imports: [AnalyzeModule, ReportModule],
})
export class AppModule {}
