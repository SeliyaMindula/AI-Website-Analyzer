import { Body, Controller, Post } from '@nestjs/common';
import { UptimeService } from './uptime.service';
import { UptimeCheckDto } from './uptime.dto';

@Controller('uptime')
export class UptimeController {
  constructor(private readonly uptimeService: UptimeService) {}

  @Post('check')
  check(@Body() dto: UptimeCheckDto) {
    return this.uptimeService.check(dto.url);
  }
}
