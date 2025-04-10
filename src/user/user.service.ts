import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleDB } from 'src/drizzle/types/drizzle';
import { eq } from 'drizzle-orm';
import * as t from '../drizzle/schema/schema';

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
    return await this.db.select().from(t.users).where(eq(t.users.id, id));
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
