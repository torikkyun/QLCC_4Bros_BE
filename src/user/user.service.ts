import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleDB } from 'src/drizzle/types/drizzle';
import { eq } from 'drizzle-orm';
import * as t from '../drizzle/schema/schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async create(createUserDto: CreateUserDto) {
    return await this.db.insert(t.users).values(createUserDto).returning();
  }

  async findAll() {
    return await this.db.query.users.findMany();
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
