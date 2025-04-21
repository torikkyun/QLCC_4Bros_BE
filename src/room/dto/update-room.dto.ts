import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MaxLength,
  MinLength,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class UpdateRoomDto {
  @ApiProperty({ required: false, example: 'C203' })
  @IsString()
  @IsOptional()
  @MaxLength(5)
  @MinLength(2)
  roomNumber?: string;

  @ApiProperty({ required: false, example: 1000 })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({ required: false, example: 'this is a description' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  @MinLength(5)
  description?: string;
}
