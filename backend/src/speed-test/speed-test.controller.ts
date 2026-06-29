import { Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { SpeedTestService } from './speed-test.service';

@Controller('speed-test')
export class SpeedTestController {
  constructor(private readonly speedTest: SpeedTestService) {}

  private clientIp(req: Request): string {
    return (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ?? req.ip ?? 'unknown';
  }

  @Get('ping')
  ping(@Req() req: Request) {
    this.speedTest.trackRequest(this.clientIp(req));
    return this.speedTest.ping();
  }

  @Get('download')
  download(@Query('size') size: string, @Req() req: Request, @Res() res: Response) {
    this.speedTest.trackRequest(this.clientIp(req));
    const buffer = this.speedTest.download(size ?? '1mb');
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Length': buffer.length,
      'Cache-Control': 'no-store',
    });
    res.send(buffer);
  }

  @Post('upload')
  upload(@Req() req: Request) {
    this.speedTest.trackRequest(this.clientIp(req));
    return this.speedTest.upload(req);
  }
}
