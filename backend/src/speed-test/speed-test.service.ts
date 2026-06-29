import { Injectable, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';

const SIZES = {
  '1mb': 1024 * 1024,
  '5mb': 5 * 1024 * 1024,
} as const;

type SizeKey = keyof typeof SIZES;

@Injectable()
export class SpeedTestService {
  private readonly buffers = new Map<SizeKey, Buffer>();
  private readonly hits = new Map<string, { count: number; resetAt: number }>();
  private readonly limit = 30;
  private readonly windowMs = 60_000;

  ping() {
    return { timestamp: Date.now() };
  }

  download(size: string): Buffer {
    this.assertSize(size);
    return this.getBuffer(size as SizeKey);
  }

  upload(req: Request): { receivedBytes: number } {
    const receivedBytes = req.body?.length ?? Number(req.headers['content-length'] ?? 0);
    return { receivedBytes };
  }

  trackRequest(ip: string) {
    const now = Date.now();
    const entry = this.hits.get(ip);
    if (!entry || now > entry.resetAt) {
      this.hits.set(ip, { count: 1, resetAt: now + this.windowMs });
      return;
    }
    entry.count++;
    if (entry.count > this.limit) {
      throw new HttpException('Too many speed test requests. Try again later.', HttpStatus.TOO_MANY_REQUESTS);
    }
  }

  private assertSize(size: string): asserts size is SizeKey {
    if (!(size in SIZES)) {
      throw new BadRequestException('Invalid size. Use 1mb or 5mb');
    }
  }

  private getBuffer(size: SizeKey): Buffer {
    if (!this.buffers.has(size)) {
      this.buffers.set(size, Buffer.alloc(SIZES[size], 0x61));
    }
    return this.buffers.get(size)!;
  }
}
