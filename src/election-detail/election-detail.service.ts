import { Inject, Injectable } from '@nestjs/common';
import { CreateElectionDetailDto } from './dto/create-election-detail.dto';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleDB } from 'src/drizzle/types/drizzle';
import * as t from '../drizzle/schema/schema';
import { ElectionDetailPaginationDto } from './dto/election-detail-pagination.dto';
import { and, asc, count, desc, eq } from 'drizzle-orm';

@Injectable()
export class ElectionDetailService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async createMany(createElectionDetailsDto: CreateElectionDetailDto) {
    const results = await this.db
      .insert(t.electionDetails)
      .values(createElectionDetailsDto.items)
      .returning();
    return results;
  }

  async findAll(electionDetailPaginationDto: ElectionDetailPaginationDto) {
    const {
      page = 1,
      limit = 10,
      order = 'desc',
    } = electionDetailPaginationDto;
    const offset = (page - 1) * limit;

    const orderByCondition =
      order === 'asc' ? [asc(t.rooms.id)] : [desc(t.rooms.id)];

    const [data, total] = await Promise.all([
      this.db
        .select({
          election: t.elections,
          candidate: t.candidates,
        })
        .from(t.electionDetails)
        .innerJoin(
          t.elections,
          eq(t.electionDetails.electionId, t.elections.id),
        )
        .innerJoin(
          t.candidates,
          eq(t.electionDetails.candidateId, t.candidates.id),
        )
        .orderBy(...orderByCondition)
        .limit(limit)
        .offset(offset),

      this.db.select({ count: count() }).from(t.rooms),
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

  async remove(electionId: number, candidateId: number) {
    return await this.db
      .delete(t.electionDetails)
      .where(
        and(
          eq(t.electionDetails.electionId, electionId),
          eq(t.electionDetails.candidateId, candidateId),
        ),
      );
  }
}
