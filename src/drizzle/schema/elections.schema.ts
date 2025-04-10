import { pgTable, pgEnum } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';

export const statusElectionEnum = pgEnum('election_status', [
  'upcoming',
  'ongoing',
  'completed',
]);

export const elections = pgTable('elections', {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  title: t.varchar('title', { length: 50 }).notNull(),
  description: t.varchar('description', { length: 100 }),
  startDate: t.date('start_date').notNull(),
  endDate: t.date('end_date').notNull(),
  status: statusElectionEnum().default('upcoming').notNull(),
});
