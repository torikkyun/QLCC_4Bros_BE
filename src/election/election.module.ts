import { Module } from '@nestjs/common';
import { ElectionService } from './election.service';
import { ElectionController } from './election.controller';
import { DrizzleModule } from 'src/drizzle/drizzle.module';

@Module({
  controllers: [ElectionController],
  providers: [ElectionService],
  imports: [DrizzleModule],
})
export class ElectionModule {}
