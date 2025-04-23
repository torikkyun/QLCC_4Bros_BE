import { Module } from '@nestjs/common';
import { DrizzleModule } from './drizzle/drizzle.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RoomModule } from './room/room.module';
import { CandidateModule } from './candidate/candidate.module';
import { ElectionModule } from './election/election.module';
import { VoteModule } from './vote/vote.module';
import { SeedService } from './drizzle/seed.service';
import { ElectionDetailModule } from './election-detail/election-detail.module';

@Module({
  imports: [
    DrizzleModule,
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    AuthModule,
    RoomModule,
    CandidateModule,
    ElectionModule,
    VoteModule,
    ElectionDetailModule,
  ],
  providers: [SeedService],
})
export class AppModule {}
