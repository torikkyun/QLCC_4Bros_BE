import { ApiProperty } from '@nestjs/swagger';

export class BookRoomDto {
  @ApiProperty({ required: true, example: 1 })
  id: number;
}
