import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { statusElectionEnum } from 'src/drizzle/schema/elections.schema';

export class CreateElectionDto {
  @ApiProperty({ example: 'Election 2025', required: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  title: string;

  @ApiProperty({ example: 'Description of election', required: false })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '2025-04-12' })
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2025-04-15' })
  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @ApiProperty({
    required: false,
    enum: statusElectionEnum.enumValues,
  })
  @IsOptional()
  @IsEnum(statusElectionEnum.enumValues, {
    message: `status must be one of the following values: upcoming, ongoing, completed`,
  })
  status?: (typeof statusElectionEnum.enumValues)[number] = 'upcoming';
}
