import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomDto {
  @ApiProperty({ required: true, example: 'C203' })
  roomNumber: string;

  @ApiProperty({ required: true, example: 1000 })
  price: number;

  @ApiProperty({ required: false, example: 'this is a description' })
  description?: string;
}
