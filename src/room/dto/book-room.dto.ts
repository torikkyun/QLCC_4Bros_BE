import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class BookRoomDto {
  @ApiProperty({ required: true, example: 1 })
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
