import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCandidateDto {
  @ApiProperty({ required: true, example: 'This is an introduction' })
  @IsString()
  @MaxLength(200)
  @MinLength(5)
  introduction: string;

  @ApiProperty({ required: false, example: 'This is a description' })
  @IsString()
  @MaxLength(100)
  @MinLength(5)
  description?: string;

  @ApiProperty({ required: true, example: 1 })
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
