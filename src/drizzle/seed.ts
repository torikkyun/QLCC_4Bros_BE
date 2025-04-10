import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import { users } from './schema/users.schema';

async function seedManagerAccount() {
  // Kết nối với database
  const pool = new Pool({
    connectionString:
      'postgres://postgres:postgres@localhost:5432/data_QLCC_4Bros_BE?sslmode=disable',
  });

  const db = drizzle(pool);

  try {
    const saltRounds = 10;
    const plainPassword = 'manager';
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    const managerData = {
      email: 'manager@gmail.com',
      password: hashedPassword,
      firstName: 'System',
      lastName: 'Manager',
      role: 'manager' as const,
    };

    await db.insert(users).values(managerData);

    console.log('✅ Tài khoản manager đã được tạo thành công');
  } catch (error) {
    console.error('❌ Lỗi khi tạo tài khoản manager:', error);
  } finally {
    await pool.end();
  }
}

seedManagerAccount();
