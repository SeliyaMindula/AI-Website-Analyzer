import { Body, Controller, Post } from '@nestjs/common';
import { SslService } from './ssl.service';
import { SslCheckDto } from './ssl.dto';

@Controller('ssl')
export class SslController {
  constructor(private readonly sslService: SslService) {}

  @Post('check')
  check(@Body() dto: SslCheckDto) {
    return this.sslService.check(dto.domain);
  }
}
