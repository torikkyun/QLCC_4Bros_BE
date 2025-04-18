import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateVoteDto } from './dto/create-vote.dto';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleDB } from 'src/drizzle/types/drizzle';
import { asc, count, desc, eq, and } from 'drizzle-orm';
import * as t from '../drizzle/schema/schema';
import { VotePaginationDto } from './dto/vote-pagination.dto';
import { RemoveVoteDto } from './dto/remove-vote.dto';

@Injectable()
export class VoteService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async create(createVoteDto: CreateVoteDto, userId: number) {
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
    return await this.db
      .insert(t.votes)
      .values({ ...createVoteDto, userId })
      .returning();
  }

  async findAll(votePaginationDto: VotePaginationDto) {
    const { page = 1, limit = 10, order = 'desc' } = votePaginationDto;
    const offset = (page - 1) * limit;

    const orderByCondition =
      order === 'asc' ? [asc(t.votes.userId)] : [desc(t.votes.userId)];

    const votesQuery = this.db
      .select()
      .from(t.votes)
      .orderBy(...orderByCondition)
      .limit(limit)
      .offset(offset);

    const [votes, total, elections, candidates, users] = await Promise.all([
      votesQuery,
      this.db.select({ count: count() }).from(t.votes),
      this.db.select().from(t.elections),
      this.db.select().from(t.candidates),
      this.db.select().from(t.users),
    ]);

    const data = votes.map((vote) => {
      const candidate = candidates.find((c) => c.id === vote.candidateId);
      if (!candidate) {
        return {
          voteAt: vote.voteAt,
          election: elections.find((e) => e.id === vote.electionId) || null,
          candidate: null,
          user: users.find((u) => u.id === vote.userId) || null,
        };
      }
      const userForCandidate = users.find((u) => u.id === candidate.userId);
      return {
        voteAt: vote.voteAt,
        election: elections.find((e) => e.id === vote.electionId),
        candidate: {
          id: candidate.id,
          introduction: candidate.introduction,
          description: candidate.description,
          user: userForCandidate,
        },
        user: users.find((u) => u.id === vote.userId),
      };
    });

    return {
      data,
      pagination: {
        total: total[0].count,
        page,
        limit,
        totalPages: Math.ceil(total[0].count / limit),
      },
    };
  }

  async remove(removeVoteDto: RemoveVoteDto, userId: number) {
    return await this.db
      .delete(t.votes)
      .where(
        and(
          eq(t.votes.userId, userId),
          eq(t.votes.electionId, removeVoteDto.electionId),
        ),
      );
  }
}
