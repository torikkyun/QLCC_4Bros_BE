import { pgTable } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import { elections } from './elections.schema';
import { candidates } from './candidates.schema';

export const electionDetails = pgTable(
  'election_details',
  {
    electionId: t
      .integer('election_id')
      .notNull()
      .references(() => elections.id, { onDelete: 'cascade' }),
    candidateId: t
      .integer('candidate_id')
      .notNull()
      .references(() => candidates.id, { onDelete: 'cascade' }),
  },
  (table) => [t.primaryKey({ columns: [table.electionId, table.candidateId] })],
);
