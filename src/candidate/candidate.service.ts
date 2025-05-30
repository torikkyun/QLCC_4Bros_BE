import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleDB } from 'src/drizzle/types/drizzle';
import * as t from '../drizzle/schema/schema';
import { CandidatePaginationDto } from './dto/candidate-pagination.dto';
import { eq, asc, count, desc } from 'drizzle-orm';

@Injectable()
export class CandidateService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async create(createCandidateDto: CreateCandidateDto, userId: number) {
    const existingCandidate = await this.db
      .select()
      .from(t.candidates)
      .where(eq(t.candidates.userId, userId));

    if (existingCandidate.length) {
      throw new ConflictException('This user is already a candidate');
    }

    const [candidate] = await this.db
      .insert(t.candidates)
      .values({ ...createCandidateDto, userId })
      .returning();

    const [result] = await this.db
      .select({
        id: t.candidates.id,
        description: t.candidates.description,
        user: {
          id: t.users.id,
          email: t.users.email,
          firstName: t.users.firstName,
          lastName: t.users.lastName,
        },
      })
      .from(t.candidates)
      .innerJoin(t.users, eq(t.candidates.userId, t.users.id))
      .where(eq(t.candidates.id, candidate.id));

    return result;
  }

  async findAll(candidatePaginationDto: CandidatePaginationDto) {
    const { page = 1, limit = 10, order = 'desc' } = candidatePaginationDto;
    const offset = (page - 1) * limit;

    const orderByCondition =
      order === 'asc' ? [asc(t.candidates.id)] : [desc(t.candidates.id)];

    const [data, total] = await Promise.all([
      this.db
        .select({
          id: t.candidates.id,
          description: t.candidates.description,
          user: {
            id: t.users.id,
            email: t.users.email,
            firstName: t.users.firstName,
            lastName: t.users.lastName,
          },
        })
        .from(t.candidates)
        .leftJoin(t.users, eq(t.candidates.userId, t.users.id))
        .orderBy(...orderByCondition)
        .limit(limit)
        .offset(offset),

      this.db.select({ count: count() }).from(t.candidates),
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
      .select({
        id: t.candidates.id,
        description: t.candidates.description,
        user: {
          id: t.users.id,
          email: t.users.email,
          firstName: t.users.firstName,
          lastName: t.users.lastName,
        },
      })
      .from(t.candidates)
      .leftJoin(t.users, eq(t.candidates.userId, t.users.id))
      .where(eq(t.candidates.id, id));
    return result;
  }

  async update(id: number, updateCandidateDto: UpdateCandidateDto) {
    const existingCandidate = await this.db
      .select()
      .from(t.candidates)
      .where(eq(t.candidates.id, id))
      .limit(1);

    if (!existingCandidate.length) {
      throw new NotFoundException(`Candidate with id ${id} not found`);
    }

    await this.db
      .update(t.candidates)
      .set(updateCandidateDto)
      .where(eq(t.candidates.id, id));

    const [result] = await this.db
      .select({
        id: t.candidates.id,
        description: t.candidates.description,
        user: {
          id: t.users.id,
          email: t.users.email,
          firstName: t.users.firstName,
          lastName: t.users.lastName,
        },
      })
      .from(t.candidates)
      .leftJoin(t.users, eq(t.candidates.userId, t.users.id))
      .where(eq(t.candidates.id, id));

    return result;
  }

  async remove(id: number) {
    return await this.db.delete(t.candidates).where(eq(t.candidates.id, id));
  }
}
