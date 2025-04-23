import { Module } from '@nestjs/common';
import { ElectionDetailService } from './election-detail.service';
import { ElectionDetailController } from './election-detail.controller';

@Module({
  controllers: [ElectionDetailController],
  providers: [ElectionDetailService],
})
export class ElectionDetailModule {}
