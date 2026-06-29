import { Injectable } from '@nestjs/common';
import {
  AnalysisSummary,
  Grade,
  RawAnalysisReport,
  Recommendation,
  isSectionError,
} from '../types/analysis.types';
import { SummaryProvider } from './summary-provider.interface';

@Injectable()
export class RuleBasedSummaryProvider implements SummaryProvider {
  async generate(report: RawAnalysisReport): Promise<AnalysisSummary> {
    const scores: number[] = [];
    const recommendations: Recommendation[] = [];

    if (!isSectionError(report.seo)) {
      scores.push(report.seo.score);
      report.seo.issues.slice(0, 2).forEach((i) =>
        recommendations.push({
          priority: i.severity === 'error' ? 'high' : 'medium',
          category: 'seo',
          message: i.message,
        }),
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
        recommendations.push({
          priority: 'high',
          category: 'speed',
          message: 'Improve mobile performance score',
        });
      }
    }
    if (!isSectionError(report.techStack) && report.techStack.technologies.length === 0) {
      recommendations.push({
        priority: 'low',
        category: 'tech',
        message: 'No major technologies detected — verify tracking and stack setup',
      });
    }

    const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 50;
    const grade = this.toGrade(avg);
    const overview = this.buildOverview(report, grade, avg);

    return {
      grade,
      overview,
      recommendations: recommendations.slice(0, 5),
    };
  }

  private buildOverview(report: RawAnalysisReport, grade: Grade, avg: number): string {
    const hostname = this.safeHostname(report.url);
    const parts: string[] = [
      `${hostname} received an overall ${grade} grade (${Math.round(avg)}/100 average across scored categories).`,
    ];

    if (!isSectionError(report.seo)) {
      const seoNote =
        report.seo.issues.length > 0
          ? `${report.seo.issues.length} SEO issue(s) need attention`
          : 'SEO fundamentals look healthy';
      parts.push(`SEO: ${report.seo.score}/100 — ${seoNote}.`);
    } else {
      parts.push(`SEO: unavailable (${report.seo.error}).`);
    }

    if (!isSectionError(report.security)) {
      const missing = report.security.headers.filter((h) => h.status === 'missing').length;
      parts.push(
        `Security: ${report.security.score}/100 — ${missing} recommended header(s) missing.`,
      );
    } else {
      parts.push(`Security: unavailable (${report.security.error}).`);
    }

    if (!isSectionError(report.speed)) {
      const cwv =
        [report.speed.lcp, report.speed.cls, report.speed.inp].filter((v) => v.pass).length;
      parts.push(
        `Speed: ${report.speed.performanceScore}/100 mobile performance; ${cwv}/3 Core Web Vitals passing.`,
      );
    } else {
      parts.push(`Speed: unavailable (${report.speed.error}).`);
    }

    if (!isSectionError(report.techStack)) {
      const names = report.techStack.technologies.slice(0, 3).map((t) => t.name);
      parts.push(
        names.length > 0
          ? `Tech stack: detected ${report.techStack.technologies.length} technology(ies) including ${names.join(', ')}.`
          : 'Tech stack: no major frameworks or CMS detected.',
      );
    } else {
      parts.push(`Tech stack: unavailable (${report.techStack.error}).`);
    }

    return parts.join(' ');
  }

  private safeHostname(url: string): string {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  }

  private toGrade(avg: number): Grade {
    if (avg >= 90) return 'A';
    if (avg >= 80) return 'B';
    if (avg >= 70) return 'C';
    if (avg >= 60) return 'D';
    return 'F';
  }
}
