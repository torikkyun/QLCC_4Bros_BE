import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleDB } from 'src/drizzle/types/drizzle';
import { asc, count, desc, eq, and } from 'drizzle-orm';
import * as t from '../drizzle/schema/schema';

@Injectable()
export class VoteService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async create(createVoteDto: CreateVoteDto) {
    const existingVote = await this.db
      .select()
      .from(t.votes)
      .where(
        and(
          eq(t.votes.userId, createVoteDto.userId),
          eq(t.votes.electionId, createVoteDto.electionId),
        ),
      )
      .limit(1);
    if (existingVote.length) {
      throw new ConflictException(
        `User ${createVoteDto.userId} has already voted in election ${createVoteDto.electionId}`,
      );
    }
    return await this.db.insert(t.votes).values(createVoteDto).returning();
  }

  findAll() {
    return `This action returns all vote`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vote`;
  }

  update(id: number, updateVoteDto: UpdateVoteDto) {
    return `This action updates a #${id} vote`;
  }

  remove(id: number) {
    return `This action removes a #${id} vote`;
  }
}
