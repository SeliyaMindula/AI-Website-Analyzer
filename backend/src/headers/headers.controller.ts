import { Body, Controller, Post } from '@nestjs/common';
import { HeadersService } from './headers.service';
import { HeadersCheckDto } from './headers.dto';

@Controller('headers')
export class HeadersController {
  constructor(private readonly headersService: HeadersService) {}

  @Post('check')
  check(@Body() dto: HeadersCheckDto) {
    return this.headersService.check(dto.url);
  }
}
