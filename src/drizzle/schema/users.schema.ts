import { pgTable, pgEnum } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';

export const rolesEnum = pgEnum('roles', ['user', 'manager']);

export const users = pgTable('users', {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  email: t.varchar('email', { length: 50 }).notNull().unique(),
  password: t.varchar('password', { length: 200 }).notNull(),
  firstName: t.varchar('first_name', { length: 50 }).notNull(),
  lastName: t.varchar('last_name', { length: 50 }).notNull(),
  role: rolesEnum().default('user').notNull(),
});
