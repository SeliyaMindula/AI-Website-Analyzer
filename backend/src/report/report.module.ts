import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { PdfGeneratorService } from './pdf-generator.service';

@Module({
  controllers: [ReportController],
  providers: [ReportService, PdfGeneratorService],
})
export class ReportModule {}
