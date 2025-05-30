import { pgTable } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const candidates = pgTable('candidates', {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  description: t.varchar('description', { length: 100 }),
  userId: t
    .integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .unique(),
});
