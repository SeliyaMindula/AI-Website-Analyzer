import { Body, Controller, Post } from '@nestjs/common';
import { LinksCheckDto } from './links.dto';
import { LinksService } from './links.service';

@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Post('check')
  check(@Body() dto: LinksCheckDto) {
    return this.linksService.check(dto.url);
  }
}
