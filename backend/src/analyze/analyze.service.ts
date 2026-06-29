import { Injectable } from '@nestjs/common';
import { HttpFetcherService } from '../fetcher/http-fetcher.service';
import { SeoAnalyzer } from '../analyzers/seo.analyzer';
import { SecurityAnalyzer } from '../analyzers/security.analyzer';
import { TechStackAnalyzer } from '../analyzers/tech-stack.analyzer';
import { SpeedAnalyzer } from '../analyzers/speed.analyzer';
import { SummaryFactory } from '../summary/summary.factory';
import { AnalysisReport, SectionError } from '../types/analysis.types';

@Injectable()
export class AnalyzeService {
  constructor(
    private readonly fetcher: HttpFetcherService,
    private readonly seo: SeoAnalyzer,
    private readonly security: SecurityAnalyzer,
    private readonly tech: TechStackAnalyzer,
    private readonly speed: SpeedAnalyzer,
    private readonly summaryFactory: SummaryFactory,
  ) {}

  async analyze(url: string): Promise<AnalysisReport> {
    let fetchResult;
    try {
      fetchResult = await this.fetcher.fetch(url);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not reach website';
      const sectionError: SectionError = { error: message };
      return {
        url,
        analyzedAt: new Date().toISOString(),
        summary: { grade: 'F', overview: message, recommendations: [] },
        seo: sectionError,
        security: sectionError,
        speed: await this.speed.analyze(url),
        techStack: sectionError,
      };
    }

    const [seoSettled, secSettled, techSettled, speedSettled] = await Promise.allSettled([
      Promise.resolve(this.seo.analyze(fetchResult)),
      Promise.resolve(this.security.analyze(fetchResult)),
      Promise.resolve(this.tech.analyze(fetchResult)),
      this.speed.analyze(fetchResult.finalUrl),
    ]);

    const unwrap = <T>(r: PromiseSettledResult<T>, fallback: SectionError): T | SectionError =>
      r.status === 'fulfilled' ? r.value : { error: 'Analysis failed' };

    const seo = unwrap(seoSettled, { error: 'SEO analysis failed' });
    const security = unwrap(secSettled, { error: 'Security analysis failed' });
    const techStack = unwrap(techSettled, { error: 'Tech stack analysis failed' });
    const speed = unwrap(speedSettled, { error: 'Speed analysis failed' });

    const raw = { url: fetchResult.finalUrl, seo, security, speed, techStack };
    const summary = await this.summaryFactory.getProvider().generate(raw);

    return { analyzedAt: new Date().toISOString(), summary, ...raw };
  }
}
