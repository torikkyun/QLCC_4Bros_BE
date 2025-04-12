import { Module } from '@nestjs/common';
import { CandidateService } from './candidate.service';
import { CandidateController } from './candidate.controller';
import { DrizzleModule } from 'src/drizzle/drizzle.module';

@Module({
  controllers: [CandidateController],
  providers: [CandidateService],
  imports: [DrizzleModule],
})
export class CandidateModule {}
