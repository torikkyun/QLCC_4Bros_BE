import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleDB } from 'src/drizzle/types/drizzle';
import { asc, count, desc, eq } from 'drizzle-orm';
import * as t from '../drizzle/schema/schema';
import * as bcrypt from 'bcrypt';
import { UserPaginationDto } from './dto/user-pagination.dto';

@Injectable()
export class UserService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async create(createUserDto: CreateUserDto) {
    return await this.db.insert(t.users).values(createUserDto).returning();
  }

  async findAll(userPaginationDto: UserPaginationDto) {
    const { page = 1, limit = 10, order = 'desc' } = userPaginationDto;
    const offset = (page - 1) * limit;

    const orderByCondition =
      order === 'asc' ? [asc(t.users.id)] : [desc(t.users.id)];

    const [data, total] = await Promise.all([
      this.db.query.users.findMany({
        offset,
        limit,
        orderBy: orderByCondition,
      }),
      this.db.select({ count: count() }).from(t.users),
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

  async findByEmail(email: string) {
    return await this.db.select().from(t.users).where(eq(t.users.email, email));
  }

  async findById(id: number) {
    const [result] = await this.db
      .select()
      .from(t.users)
      .where(eq(t.users.id, id));
    return result;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      const password = await bcrypt.hash(updateUserDto.password, 10);
      updateUserDto.password = password;
    }
    const [result] = await this.db
      .update(t.users)
      .set(updateUserDto)
      .where(eq(t.users.id, id))
      .returning();
    return result;
  }

  async remove(id: number) {
    return await this.db.delete(t.users).where(eq(t.users.id, id));
  }
}
