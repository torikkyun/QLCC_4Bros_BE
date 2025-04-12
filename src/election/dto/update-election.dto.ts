import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { statusElectionEnum } from 'src/drizzle/schema/elections.schema';

export class UpdateElectionDto {
  @ApiProperty({ required: false, example: 'Election 2025' })
  @IsString()
  @MaxLength(50)
  @IsOptional()
  title?: string;

  @ApiProperty({ required: false, example: 'Description of election' })
  @IsString()
  @MaxLength(100)
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

  @ApiProperty({ required: false, example: 'upcoming' })
  @IsOptional()
  status?: (typeof statusElectionEnum.enumValues)[number];
}
