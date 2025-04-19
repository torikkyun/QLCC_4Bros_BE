import { Injectable, OnModuleInit } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import { users } from './schema/users.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    await this.seedManagerAccount();
  }

  async seedManagerAccount() {
    const pool = new Pool({
      connectionString: this.configService.get<string>('DATABASE_URL'),
    });
    const db = drizzle(pool);

    const existingUsers = await db.select().from(users).limit(1);
    if (existingUsers.length > 0) {
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

    const userData = {
      email: 'user@gmail.com',
      password: await bcrypt.hash('123456', saltRounds),
      firstName: 'Đức',
      lastName: 'Trần',
      role: 'user' as const,
    };
    await db.insert(users).values(userData);

    await pool.end();
  }
}
