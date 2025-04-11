import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { DrizzleModule } from 'src/drizzle/drizzle.module';

@Module({
  controllers: [RoomController],
  providers: [RoomService],
  imports: [DrizzleModule],
})
export class RoomModule {}
