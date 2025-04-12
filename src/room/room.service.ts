import { Inject, Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { DrizzleDB } from 'src/drizzle/types/drizzle';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { eq, and, count } from 'drizzle-orm';
import * as t from '../drizzle/schema/schema';
import { BookRoomDto } from './dto/book-room.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class RoomService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async create(createRoomDto: CreateRoomDto) {
    return await this.db.insert(t.rooms).values(createRoomDto).returning();
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const offset = (page - 1) * limit;

    const [rooms, total] = await Promise.all([
      this.db.query.rooms.findMany({
        offset,
        limit,
        // orderBy: (rooms, { desc }) => [desc(rooms.createdAt)],
      }),
      this.db.select({ count: count() }).from(t.rooms),
    ]);

    return {
      data: rooms,
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
      .from(t.rooms)
      .where(eq(t.rooms.id, id));
    return result;
  }

  async findVacantRooms() {
    return await this.db
      .select()
      .from(t.rooms)
      .where(eq(t.rooms.status, t.statusRoomEnum.enumValues[1]));
  }

  async update(id: number, updateRoomDto: UpdateRoomDto) {
    const [result] = await this.db
      .update(t.rooms)
      .set(updateRoomDto)
      .where(eq(t.rooms.id, id))
      .returning();
    return result;
  }

  async bookRoom(roomId: number, bookRoomDto: BookRoomDto) {
    const room = await this.db
      .select()
      .from(t.rooms)
      .where(
        and(
          eq(t.rooms.id, roomId),
          eq(t.rooms.status, t.statusRoomEnum.enumValues[1]),
        ),
      )
      .limit(1);

    if (!room.length) {
      throw new Error('Room does not exist or is already booked');
    }

    await this.db
      .update(t.rooms)
      .set({
        status: t.statusRoomEnum.enumValues[0],
        userId: bookRoomDto.id,
      })
      .where(eq(t.rooms.id, roomId));

    return this.db
      .select()
      .from(t.rooms)
      .where(eq(t.rooms.id, roomId))
      .limit(1);
  }

  async remove(id: number) {
    return await this.db.delete(t.rooms).where(eq(t.rooms.id, id));
  }
}
