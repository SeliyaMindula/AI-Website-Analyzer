import { Body, Controller, Post } from '@nestjs/common';
import { DnsService } from './dns.service';
import { DnsLookupDto } from './dns.dto';

@Controller('dns')
export class DnsController {
  constructor(private readonly dnsService: DnsService) {}

  @Post('lookup')
  lookup(@Body() dto: DnsLookupDto) {
    return this.dnsService.lookup(dto.domain);
  }
}
