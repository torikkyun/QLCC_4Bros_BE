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
import { eq, asc, count, desc } from 'drizzle-orm';

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

  async remove(id: number) {
    return await this.db.delete(t.elections).where(eq(t.elections.id, id));
  }
}
