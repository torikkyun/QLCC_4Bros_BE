import {
  Injectable,
  PipeTransform,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { eq } from 'drizzle-orm';
import * as t from 'src/drizzle/schema/schema';
import { DrizzleDB } from 'src/drizzle/types/drizzle';

@Injectable()
export class UserExistsPipe implements PipeTransform {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async transform(value: number | { userId: number }) {
    const userId = typeof value === 'number' ? value : value.userId;

    const user = await this.db.query.users.findFirst({
      where: eq(t.users.id, userId),
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return value;
  }
}
