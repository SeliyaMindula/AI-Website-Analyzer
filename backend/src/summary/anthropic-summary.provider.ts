import { Injectable } from '@nestjs/common';
import { SummaryProvider } from './summary-provider.interface';
import { AnalysisSummary, RawAnalysisReport } from '../types/analysis.types';

@Injectable()
export class AnthropicSummaryProvider implements SummaryProvider {
  async generate(_report: RawAnalysisReport): Promise<AnalysisSummary> {
    throw new Error('Anthropic summary provider not implemented in v1');
  }
}
