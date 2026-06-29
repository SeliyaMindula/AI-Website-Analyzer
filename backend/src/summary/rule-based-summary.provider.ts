import { Injectable } from '@nestjs/common';
import { AnalysisSummary, Grade, RawAnalysisReport, Recommendation, isSectionError } from '../types/analysis.types';
import { SummaryProvider } from './summary-provider.interface';

@Injectable()
export class RuleBasedSummaryProvider implements SummaryProvider {
  async generate(report: RawAnalysisReport): Promise<AnalysisSummary> {
    const scores: number[] = [];
    const recommendations: Recommendation[] = [];

    if (!isSectionError(report.seo)) {
      scores.push(report.seo.score);
      report.seo.issues.slice(0, 2).forEach((i) =>
        recommendations.push({ priority: i.severity === 'error' ? 'high' : 'medium', category: 'seo', message: i.message }),
      );
    }
    if (!isSectionError(report.security)) {
      scores.push(report.security.score);
      report.security.issues.slice(0, 2).forEach((i) =>
        recommendations.push({ priority: 'medium', category: 'security', message: i.message }),
      );
    }
    if (!isSectionError(report.speed)) {
      scores.push(report.speed.performanceScore);
      if (report.speed.performanceScore < 80) {
        recommendations.push({ priority: 'high', category: 'speed', message: 'Improve mobile performance score' });
      }
    }

    const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 50;
    const grade = this.toGrade(avg);
    const overview = `Analysis of ${report.url} shows an overall ${grade} grade (average score ${Math.round(avg)}). Review the recommendations below to improve SEO, security, and performance.`;

    return {
      grade,
      overview,
      recommendations: recommendations.slice(0, 5),
    };
  }

  private toGrade(avg: number): Grade {
    if (avg >= 90) return 'A';
    if (avg >= 80) return 'B';
    if (avg >= 70) return 'C';
    if (avg >= 60) return 'D';
    return 'F';
  }
}
