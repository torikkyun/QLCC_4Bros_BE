import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { statusElectionEnum } from 'src/drizzle/schema/elections.schema';

export class UpdateElectionDto {
  @ApiProperty({ required: false, example: 'Election 2025' })
  @IsString()
  @MaxLength(50)
  @MinLength(5)
  @IsOptional()
  title?: string;

  @ApiProperty({ required: false, example: 'Description of election' })
  @IsString()
  @MaxLength(100)
  @MinLength(5)
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false, example: '2025-04-12' })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ required: false, example: '2025-04-15' })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({ required: false, enum: statusElectionEnum.enumValues })
  @IsOptional()
  @IsEnum(statusElectionEnum.enumValues, {
    message: `status must be one of the following values: upcoming, ongoing, completed`,
  })
  status?: (typeof statusElectionEnum.enumValues)[number];
}
