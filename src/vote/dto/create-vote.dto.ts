import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateVoteDto {
  @ApiProperty({ required: true, example: 1 })
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ required: true, example: 1 })
  @IsInt()
  @IsNotEmpty()
  electionId: number;

  @ApiProperty({ required: true, example: 1 })
  @IsInt()
  @IsNotEmpty()
  candidateId: number;
}
