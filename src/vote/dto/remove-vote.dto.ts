import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class RemoveVoteDto {
  @ApiProperty({ required: true, example: 1 })
  @IsInt()
  @IsNotEmpty()
  electionId: number;
}
