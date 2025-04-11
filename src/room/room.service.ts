import { Inject, Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { DrizzleDB } from 'src/drizzle/types/drizzle';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { eq } from 'drizzle-orm';
import * as t from '../drizzle/schema/schema';

@Injectable()
export class RoomService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async create(createRoomDto: CreateRoomDto) {
    return await this.db.insert(t.rooms).values(createRoomDto).returning();
  }

  async findAll() {
    return await this.db.query.rooms.findMany();
  }

  async findById(id: number) {
    const [result] = await this.db
      .select()
      .from(t.rooms)
      .where(eq(t.rooms.id, id));
    return result;
  }

  async update(id: number, updateRoomDto: UpdateRoomDto) {
    const [result] = await this.db
      .update(t.rooms)
      .set(updateRoomDto)
      .where(eq(t.rooms.id, id))
      .returning();
    return result;
  }

  async remove(id: number) {
    return await this.db.delete(t.rooms).where(eq(t.rooms.id, id));
  }
}
