import { AnalysisSummary, RawAnalysisReport } from '../types/analysis.types';

export interface SummaryProvider {
  generate(report: RawAnalysisReport): Promise<AnalysisSummary>;
}
