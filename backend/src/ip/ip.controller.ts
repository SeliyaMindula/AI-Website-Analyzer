import { Body, Controller, Post } from '@nestjs/common';
import { IpService } from './ip.service';
import { IpLookupDto } from './ip.dto';

@Controller('ip')
export class IpController {
  constructor(private readonly ipService: IpService) {}

  @Post('lookup')
  lookup(@Body() dto: IpLookupDto) {
    return this.ipService.lookup(dto.query);
  }
}
