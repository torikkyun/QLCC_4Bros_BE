import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import { users } from './schema/users.schema';

async function seedManagerAccount() {
  const pool = new Pool({
    connectionString:
      'postgres://postgres:postgres@postgres:5432/data_QLCC_4Bros_BE?sslmode=disable',
  });

  const db = drizzle(pool);

  try {
    const existingUsers = await db.select().from(users).limit(1);

    if (existingUsers.length > 0) {
      console.log('Database already contains users. Skipping seed.');
      return;
    }

    const saltRounds = 10;

    const managerData = {
      email: 'manager@gmail.com',
      password: await bcrypt.hash('manager', saltRounds),
      firstName: 'System',
      lastName: 'Manager',
      role: 'manager' as const,
    };

    await db.insert(users).values(managerData);
    console.log('Manager account has been created successfully');

    const userData = {
      email: 'user@gmail.com',
      password: await bcrypt.hash('123456', saltRounds),
      firstName: 'Đức',
      lastName: 'Trần',
      role: 'user' as const,
    };

    await db.insert(users).values(userData);
    console.log('User account has been created successfully');
  } catch (error) {
    console.error('Error creating account:', error);
  } finally {
    await pool.end();
  }
}

seedManagerAccount().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
