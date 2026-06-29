import { Injectable } from '@nestjs/common';
import { SummaryProvider } from './summary-provider.interface';
import { RuleBasedSummaryProvider } from './rule-based-summary.provider';
import { OpenAiSummaryProvider } from './openai-summary.provider';
import { AnthropicSummaryProvider } from './anthropic-summary.provider';

@Injectable()
export class SummaryFactory {
  constructor(
    private readonly ruleBased: RuleBasedSummaryProvider,
    private readonly openai: OpenAiSummaryProvider,
    private readonly anthropic: AnthropicSummaryProvider,
  ) {}

  getProvider(): SummaryProvider {
    const kind = process.env.SUMMARY_PROVIDER ?? 'rule-based';
    if (kind === 'openai') return this.openai;
    if (kind === 'anthropic') return this.anthropic;
    return this.ruleBased;
  }
}
