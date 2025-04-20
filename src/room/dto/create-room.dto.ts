import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ required: true, example: 'C203' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(5)
  @MinLength(2)
  roomNumber: string;

  @ApiProperty({ required: true, example: 1000 })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ required: false, example: 'this is a description' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  description?: string;
}
