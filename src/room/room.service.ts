import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { DrizzleDB } from 'src/drizzle/types/drizzle';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { eq, and, count, asc, desc, SQL } from 'drizzle-orm';
import * as t from '../drizzle/schema/schema';
import { RoomPaginationDto } from './dto/room-pagination.dto';

@Injectable()
export class RoomService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async create(createRoomDto: CreateRoomDto) {
    try {
      const [result] = await this.db
        .insert(t.rooms)
        .values(createRoomDto)
        .returning();
      return result;
    } catch (error) {
      if ((error as { code: string }).code === '23505') {
        throw new ConflictException(
          `Room with room number '${createRoomDto.roomNumber}' already exists`,
        );
      }
    }
  }

  async findAll(roomPaginationDto: RoomPaginationDto) {
    const { page = 1, limit = 10, order = 'desc', status } = roomPaginationDto;
    const offset = (page - 1) * limit;

    const whereConditions: SQL[] = [];
    if (status) {
      whereConditions.push(eq(t.rooms.status, status));
    }
    const where =
      whereConditions.length > 0 ? and(...whereConditions) : undefined;

    const orderByCondition =
      order === 'asc' ? [asc(t.rooms.id)] : [desc(t.rooms.id)];

    const [data, total] = await Promise.all([
      this.db
        .select({
          id: t.rooms.id,
          roomNumber: t.rooms.roomNumber,
          price: t.rooms.price,
          status: t.rooms.status,
          description: t.rooms.description,
          user: {
            id: t.users.id,
            email: t.users.email,
            firstName: t.users.firstName,
            lastName: t.users.lastName,
          },
        })
        .from(t.rooms)
        .leftJoin(t.users, eq(t.rooms.userId, t.users.id))
        .orderBy(...orderByCondition)
        .limit(limit)
        .offset(offset)
        .where(where),

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

  async findById(id: number) {
    const [result] = await this.db
      .select({
        id: t.rooms.id,
        roomNumber: t.rooms.roomNumber,
        price: t.rooms.price,
        status: t.rooms.status,
        description: t.rooms.description,
        user: {
          id: t.users.id,
          email: t.users.email,
          firstName: t.users.firstName,
          lastName: t.users.lastName,
        },
      })
      .from(t.rooms)
      .leftJoin(t.users, eq(t.rooms.userId, t.users.id))
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

  async bookRoom(id: number, userId: number) {
    const room = await this.db
      .select()
      .from(t.rooms)
      .where(
        and(
          eq(t.rooms.id, id),
          eq(t.rooms.status, t.statusRoomEnum.enumValues[1]),
        ),
      )
      .limit(1);

    if (!room.length) {
      throw new ConflictException('Room does not exist or is already booked');
    }

    await this.db
      .update(t.rooms)
      .set({
        status: t.statusRoomEnum.enumValues[0],
        userId: userId,
      })
      .where(eq(t.rooms.id, id));

    return this.db.select().from(t.rooms).where(eq(t.rooms.id, id)).limit(1);
  }

  async cancelBookRoom(id: number, userId: number) {
    const room = await this.db
      .select()
      .from(t.rooms)
      .where(
        and(
          eq(t.rooms.id, id),
          eq(t.rooms.status, t.statusRoomEnum.enumValues[0]),
          eq(t.rooms.userId, userId),
        ),
      )
      .limit(1);

    if (!room.length) {
      throw new ForbiddenException(
        'Room is not booked or not booked by this user',
      );
    }

    await this.db
      .update(t.rooms)
      .set({
        status: t.statusRoomEnum.enumValues[1],
        userId: null,
      })
      .where(eq(t.rooms.id, id));

    return this.db.select().from(t.rooms).where(eq(t.rooms.id, id)).limit(1);
  }

  async remove(id: number) {
    return await this.db.delete(t.rooms).where(eq(t.rooms.id, id));
  }
}
