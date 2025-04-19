import { pgTable, pgEnum } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const statusRoomEnum = pgEnum('room_status', ['occupied', 'vacant']);

export const rooms = pgTable('rooms', {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  roomNumber: t.varchar('room_number', { length: 5 }).notNull().unique(),
  price: t.integer().notNull(),
  status: statusRoomEnum().default('vacant').notNull(),
  description: t.varchar('description', { length: 100 }),
  userId: t.integer().references(() => users.id, { onDelete: 'set null' }),
});
