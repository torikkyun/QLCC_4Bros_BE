import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateCandidateDto {
  @ApiProperty({ required: false, example: 'This is an introduce' })
  @IsString()
  introduce?: string;

  @ApiProperty({ required: false })
  @IsString()
  description?: string;
}
