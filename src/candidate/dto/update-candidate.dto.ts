import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateCandidateDto {
  @ApiProperty({ required: false, example: 'This is an introduction' })
  @IsString()
  introduction?: string;

  @ApiProperty({ required: false, example: 'This is a description' })
  @IsString()
  description?: string;
}
