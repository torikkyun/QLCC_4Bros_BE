import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ required: false, example: 'user@gmail.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false, example: '123456' })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({ required: false, example: 'Đức' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ required: false, example: 'Trần' })
  @IsOptional()
  @IsString()
  lastName?: string;
}
