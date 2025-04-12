import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCandidateDto {
  @ApiProperty({ required: true, example: 'This is an introduce' })
  @IsString()
  introduce: string;

  @ApiProperty({ required: false })
  @IsString()
  description?: string;

  @ApiProperty({ required: true, example: 1 })
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
