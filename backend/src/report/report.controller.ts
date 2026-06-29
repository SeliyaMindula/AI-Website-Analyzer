import { Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ReportService } from './report.service';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post('pdf')
  async pdf(@Body() body: unknown, @Res() res: Response) {
    const report = this.reportService.validateReport(body);
    const { buffer, filename } = await this.reportService.generatePdf(report);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    });
    res.send(buffer);
  }
}
