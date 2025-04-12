import { Module } from '@nestjs/common';
import { VoteService } from './vote.service';
import { VoteController } from './vote.controller';
import { DrizzleModule } from 'src/drizzle/drizzle.module';

@Module({
  controllers: [VoteController],
  providers: [VoteService],
  imports: [DrizzleModule],
})
export class VoteModule {}
