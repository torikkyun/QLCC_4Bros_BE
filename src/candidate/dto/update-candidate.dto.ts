import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCandidateDto {
  @ApiProperty({ required: false, example: 'This is a description' })
  @IsString()
  @IsOptional()
  description?: string;
}
