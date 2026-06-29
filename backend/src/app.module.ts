import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AnalyzeModule } from './analyze/analyze.module';
import { ReportModule } from './report/report.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AnalyzeModule,
    ReportModule,
  ],
})
export class AppModule {}
