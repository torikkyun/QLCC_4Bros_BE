import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { statusRoomEnum } from 'src/drizzle/schema/rooms.schema';

export class RoomPaginationDto extends PaginationDto {
  @ApiProperty({ enum: statusRoomEnum.enumValues, required: false })
  @IsOptional()
  @IsEnum(statusRoomEnum.enumValues)
  status?: (typeof statusRoomEnum.enumValues)[number];
}
