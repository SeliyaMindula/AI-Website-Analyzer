import { Module } from '@nestjs/common';
import { SeoAnalyzer } from './seo.analyzer';
import { SecurityAnalyzer } from './security.analyzer';
import { TechStackAnalyzer } from './tech-stack.analyzer';
import { SpeedAnalyzer } from './speed.analyzer';

@Module({
  providers: [SeoAnalyzer, SecurityAnalyzer, TechStackAnalyzer, SpeedAnalyzer],
  exports: [SeoAnalyzer, SecurityAnalyzer, TechStackAnalyzer, SpeedAnalyzer],
})
export class AnalyzersModule {}
