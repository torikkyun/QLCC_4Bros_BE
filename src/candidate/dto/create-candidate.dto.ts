import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCandidateDto {
  @ApiProperty({ required: false, example: 'This is a description' })
  @IsString()
  @MaxLength(100)
  @MinLength(5)
  description?: string;
}
