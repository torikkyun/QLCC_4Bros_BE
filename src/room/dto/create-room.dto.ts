import { ApiProperty } from '@nestjs/swagger';
import { statusRoomEnum } from 'src/drizzle/schema/schema';

export class CreateRoomDto {
  @ApiProperty({ required: true, example: 'C203' })
  roomNumber: string;

  @ApiProperty({ required: true, example: 1000 })
  price: number;

  @ApiProperty({ required: true, example: 'vacant' })
  status: (typeof statusRoomEnum.enumValues)[number];

  @ApiProperty({ required: false, example: 'this is a description' })
  description?: string;
}
