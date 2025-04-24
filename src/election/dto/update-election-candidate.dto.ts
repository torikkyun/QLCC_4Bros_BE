import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, ArrayNotEmpty } from 'class-validator';

export class UpdateElectionCandidateDto {
  @ApiProperty({
    type: [Number],
    required: true,
    example: [1, 3, 5],
    description: 'Danh sách candidateId được chọn trong cuộc bầu cử',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  candidateIds: number[];
}
