import { Module } from '@nestjs/common';
import { VoteService } from './vote.service';
import { VoteController } from './vote.controller';
import { CandidateModule } from 'src/candidate/candidate.module';

@Module({
  controllers: [VoteController],
  providers: [VoteService],
  imports: [CandidateModule],
})
export class VoteModule {}
