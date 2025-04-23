import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ElectionDetailItem {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ required: true, example: 1 })
  electionId: number;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ required: true, example: 1 })
  candidateId: number;
}

export class CreateElectionDetailDto {
  @ApiProperty({ type: [ElectionDetailItem] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ElectionDetailItem)
  items: ElectionDetailItem[];
}
