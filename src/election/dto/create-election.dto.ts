import {
  IsDateString,
  IsOptional,
  IsString,
  MaxLength,
  Validate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { statusElectionEnum } from 'src/drizzle/schema/elections.schema';

export class CreateElectionDto {
  @ApiProperty({ example: 'Election 2025' })
  @IsString()
  @MaxLength(50)
  title: string;

  @ApiProperty({ example: 'Description of election', required: false })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '2025-04-12' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2025-04-15' })
  @IsDateString()
  @Validate(
    (value: string, { object }: { object: CreateElectionDto }) => {
      return new Date(value) >= new Date(object.startDate);
    },
    { message: 'endDate must be greater than or equal to startDate' },
  )
  endDate: string;

  @ApiProperty({ required: false, example: 'upcoming', default: 'upcoming' })
  @IsOptional()
  status?: (typeof statusElectionEnum.enumValues)[number] = 'upcoming';
}
