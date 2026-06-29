import { BadRequestException, Injectable } from '@nestjs/common';
import { AnalysisReport } from '../types/analysis.types';
import { PdfGeneratorService } from './pdf-generator.service';

@Injectable()
export class ReportService {
  constructor(private readonly pdf: PdfGeneratorService) {}

  validateReport(body: unknown): AnalysisReport {
    if (!body || typeof body !== 'object') throw new BadRequestException('Invalid report data');
    const r = body as AnalysisReport;
    if (!r.url || !r.summary || !r.analyzedAt) throw new BadRequestException('Invalid report data');
    return r;
  }

  async generatePdf(report: AnalysisReport): Promise<{ buffer: Buffer; filename: string }> {
    const buffer = await this.pdf.generate(report);
    const host = new URL(report.url).hostname.replace(/[^a-z0-9.-]/gi, '-');
    const date = report.analyzedAt.slice(0, 10);
    const filename = `website-analysis-${host}-${date}.pdf`;
    return { buffer, filename };
  }
}
