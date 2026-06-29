import { Module } from '@nestjs/common';
import { SpeedTestController } from './speed-test.controller';
import { SpeedTestService } from './speed-test.service';

@Module({
  controllers: [SpeedTestController],
  providers: [SpeedTestService],
})
export class SpeedTestModule {}
