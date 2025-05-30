import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateElectionDto } from './dto/create-election.dto';
import { UpdateElectionDto } from './dto/update-election.dto';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleDB } from 'src/drizzle/types/drizzle';
import * as t from '../drizzle/schema/schema';
import { ElectionPaginationDto } from './dto/election-pagination.dto';
import { eq, asc, count, desc, sql, inArray } from 'drizzle-orm';

@Injectable()
export class ElectionService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async create(createElectionDto: CreateElectionDto) {
    if (createElectionDto.endDate <= createElectionDto.startDate) {
      throw new BadRequestException('End date must be after start date');
    }
    const [result] = await this.db
      .insert(t.elections)
      .values({
        ...createElectionDto,
        startDate: new Date(createElectionDto.startDate)
          .toISOString()
          .split('T')[0],
        endDate: new Date(createElectionDto.endDate)
          .toISOString()
          .split('T')[0],
      })
      .returning();

    return result;
  }

  async findAll(electionPaginationDto: ElectionPaginationDto) {
    const { page = 1, limit = 10, order = 'desc' } = electionPaginationDto;
    const offset = (page - 1) * limit;

    const orderByCondition =
      order === 'asc' ? [asc(t.elections.id)] : [desc(t.elections.id)];

    const [data, total] = await Promise.all([
      this.db.query.elections.findMany({
        limit: limit,
        offset: offset,
        orderBy: orderByCondition,
      }),
      this.db.select({ count: count() }).from(t.elections),
    ]);

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

  async findById(id: number) {
    const [result] = await this.db
      .select()
      .from(t.elections)
      .where(eq(t.elections.id, id));
    return result;
  }

  async getCandidatesWithElectionStatus(electionId: number) {
    const result = await this.db
      .select({
        id: t.candidates.id,
        description: t.candidates.description,
        isSelected:
          sql<boolean>`(${t.electionDetails.electionId} IS NOT NULL)`.as(
            'isSelected',
          ),
        user: {
          id: t.users.id,
          email: t.users.email,
          firstName: t.users.firstName,
          lastName: t.users.lastName,
        },
      })
      .from(t.candidates)
      .leftJoin(
        t.electionDetails,
        sql`${t.electionDetails.candidateId} = ${t.candidates.id} AND ${t.electionDetails.electionId} = ${electionId}`,
      )
      .leftJoin(t.users, eq(t.candidates.userId, t.users.id));

    return result;
  }

  async getElectionResults(electionId: number) {
    const election = await this.findById(electionId);
    if (!election) {
      throw new NotFoundException(`Election with id ${electionId} not found`);
    }

    // if (election.status !== 'completed') {
    //   throw new BadRequestException(
    //     'Election results are only available for completed elections',
    //   );
    // }

    const candidatesInElection = await this.db
      .select({
        candidateId: t.electionDetails.candidateId,
        description: t.candidates.description,
        user: {
          id: t.users.id,
          firstName: t.users.firstName,
          lastName: t.users.lastName,
          email: t.users.email,
        },
      })
      .from(t.electionDetails)
      .innerJoin(
        t.candidates,
        eq(t.electionDetails.candidateId, t.candidates.id),
      )
      .innerJoin(t.users, eq(t.candidates.userId, t.users.id))
      .where(eq(t.electionDetails.electionId, electionId));

    if (!candidatesInElection.length) {
      throw new NotFoundException('No candidates found for this election');
    }

    const voteCounts = await this.db
      .select({
        candidateId: t.votes.candidateId,
        count: sql<number>`COUNT(*)`.as('count'),
      })
      .from(t.votes)
      .where(eq(t.votes.electionId, electionId))
      .groupBy(t.votes.candidateId);

    const voteMap = new Map<number, number>();
    voteCounts.forEach((vc) => voteMap.set(vc.candidateId, vc.count));

    return candidatesInElection.map((entry) => ({
      candidateId: entry.candidateId,
      description: entry.description,
      user: entry.user,
      voteCount: voteMap.get(entry.candidateId) || 0,
    }));
  }

  async update(id: number, updateElectionDto: UpdateElectionDto) {
    const existingElection = await this.db
      .select()
      .from(t.elections)
      .where(eq(t.elections.id, id))
      .limit(1);

    if (!existingElection.length) {
      throw new NotFoundException(`Election with id ${id} not found`);
    }

    const currentElection = existingElection[0];

    const { startDate, endDate, ...rest } = updateElectionDto;

    const newStartDate = startDate || currentElection.startDate;
    const newEndDate = endDate || currentElection.endDate;

    if (new Date(newEndDate) <= new Date(newStartDate)) {
      throw new BadRequestException(
        'endDate must be greater than or equal to startDate',
      );
    }

    // if (new Date(newStartDate) < new Date()) {
    //   throw new BadRequestException('startDate cannot be in the past');
    // }

    // if (new Date(newEndDate) < new Date()) {
    //   throw new BadRequestException('endDate cannot be in the past');
    // }

    const updateData = {
      ...rest,
      startDate: new Date(newStartDate).toISOString().split('T')[0],
      endDate: new Date(newEndDate).toISOString().split('T')[0],
    };

    const updatedElection = await this.db
      .update(t.elections)
      .set(updateData)
      .where(eq(t.elections.id, id))
      .returning();

    return updatedElection[0];
  }

  async updateElectionCandidates(electionId: number, candidateIds: number[]) {
    const existingElection = await this.findById(electionId);
    if (!existingElection) {
      throw new NotFoundException(`Election with id ${electionId} not found`);
    }

    const uniqueCandidateIds = [...new Set(candidateIds)];

    if (uniqueCandidateIds.length > 0) {
      const existingCandidates = await this.db
        .select()
        .from(t.candidates)
        .where(inArray(t.candidates.id, uniqueCandidateIds));

      if (existingCandidates.length !== uniqueCandidateIds.length) {
        throw new NotFoundException('One or more candidates not found');
      }
    }

    await this.db
      .delete(t.electionDetails)
      .where(eq(t.electionDetails.electionId, electionId));

    if (uniqueCandidateIds.length > 0) {
      const data = uniqueCandidateIds.map((candidateId) => ({
        electionId,
        candidateId,
      }));
      await this.db.insert(t.electionDetails).values(data);
    }

    return { success: true };
  }

  async remove(id: number) {
    return await this.db.delete(t.elections).where(eq(t.elections.id, id));
  }
}
