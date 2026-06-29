import { Module } from '@nestjs/common';
import { RuleBasedSummaryProvider } from './rule-based-summary.provider';
import { OpenAiSummaryProvider } from './openai-summary.provider';
import { AnthropicSummaryProvider } from './anthropic-summary.provider';
import { SummaryFactory } from './summary.factory';

@Module({
  providers: [RuleBasedSummaryProvider, OpenAiSummaryProvider, AnthropicSummaryProvider, SummaryFactory],
  exports: [SummaryFactory],
})
export class SummaryModule {}
