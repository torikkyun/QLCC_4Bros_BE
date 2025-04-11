import { ApiProperty } from '@nestjs/swagger';
import { statusRoomEnum } from 'src/drizzle/schema/schema';

export class UpdateRoomDto {
  @ApiProperty({ required: false, example: 'C203' })
  roomNumber?: string;

  @ApiProperty({ required: false, example: 1000 })
  price?: number;

  @ApiProperty({ required: false, example: 'vacant' })
  status?: (typeof statusRoomEnum.enumValues)[number];

  @ApiProperty({ required: false, example: 'this is a description' })
  description?: string;
}
