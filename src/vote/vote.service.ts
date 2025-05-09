import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVoteDto } from './dto/create-vote.dto';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleDB } from 'src/drizzle/types/drizzle';
import { eq, and } from 'drizzle-orm';
import * as t from '../drizzle/schema/schema';

@Injectable()
export class VoteService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async create(createVoteDto: CreateVoteDto, userId: number) {
    const [election] = await this.db
      .select()
      .from(t.elections)
      .where(eq(t.elections.id, createVoteDto.electionId));

    if (!election) {
      throw new NotFoundException(
        `Election with id ${createVoteDto.electionId} not found`,
      );
    }

    if (election.status === 'upcoming') {
      throw new BadRequestException(
        `Election ${createVoteDto.electionId} has not started yet`,
      );
    }

    if (election.status === 'completed') {
      throw new BadRequestException(
        `Election ${createVoteDto.electionId} has already ended`,
      );
    }

    const existingVote = await this.db
      .select()
      .from(t.votes)
      .where(
        and(
          eq(t.votes.userId, userId),
          eq(t.votes.electionId, createVoteDto.electionId),
        ),
      )
      .limit(1);

    if (existingVote.length) {
      throw new ConflictException(
        `User ${userId} has already voted in election ${createVoteDto.electionId}`,
      );
    }

    const [electionDetail] = await this.db
      .select()
      .from(t.electionDetails)
      .where(
        and(
          eq(t.electionDetails.electionId, createVoteDto.electionId),
          eq(t.electionDetails.candidateId, createVoteDto.candidateId),
        ),
      );

    if (!electionDetail) {
      throw new BadRequestException(
        `Candidate ${createVoteDto.candidateId} is not in election ${createVoteDto.electionId}`,
      );
    }

    return await this.db
      .insert(t.votes)
      .values({ ...createVoteDto, userId })
      .returning();
  }

  async checkUserVoteStatus(electionId: number, userId: number) {
    const [election] = await this.db
      .select()
      .from(t.elections)
      .where(eq(t.elections.id, electionId));

    if (!election) {
      throw new NotFoundException(`Election with id ${electionId} not found`);
    }

    const existingVote = await this.db
      .select()
      .from(t.votes)
      .where(
        and(eq(t.votes.userId, userId), eq(t.votes.electionId, electionId)),
      )
      .limit(1);

    return {
      hasVoted: existingVote.length > 0,
      electionStatus: election.status,
    };
  }
}
