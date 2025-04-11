import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ required: false, example: 'user@gmail.com' })
  email?: string;

  @ApiProperty({ required: false, example: '123456' })
  password?: string;

  @ApiProperty({ required: false, example: 'Đức' })
  firstName?: string;

  @ApiProperty({ required: false, example: 'Trần' })
  lastName?: string;
}
