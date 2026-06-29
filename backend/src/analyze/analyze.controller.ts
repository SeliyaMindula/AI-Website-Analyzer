import { Body, Controller, Post } from '@nestjs/common';
import { AnalyzeService } from './analyze.service';
import { AnalyzeDto } from './analyze.dto';

@Controller('analyze')
export class AnalyzeController {
  constructor(private readonly analyzeService: AnalyzeService) {}

  @Post()
  analyze(@Body() dto: AnalyzeDto) {
    return this.analyzeService.analyze(dto.url);
  }
}
