import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UpdateRoomDto } from './dto/update-room.dto';
import { BookRoomDto } from './dto/book-room.dto';
import { RoomPaginationDto } from './dto/room-pagination.dto';
import { CancelBookRoomDto } from './dto/cancel-book-room.dto';

@Controller('api/room')
@ApiTags('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager')
  @ApiBearerAuth()
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.create(createRoomDto);
  }

  @Get()
  findAll(@Query() roomPaginationDto: RoomPaginationDto) {
    return this.roomService.findAll(roomPaginationDto);
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.roomService.findById(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  update(@Param('id') id: number, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomService.update(+id, updateRoomDto);
  }

  @Post(':id/book')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  bookRoom(@Param('id') id: number, @Body() bookRoomDto: BookRoomDto) {
    return this.roomService.bookRoom(id, bookRoomDto);
  }

  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  cancelBookRoom(
    @Param('id') id: number,
    @Body() cancelBookRoomDto: CancelBookRoomDto,
  ) {
    return this.roomService.cancelBookRoom(id, cancelBookRoomDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager')
  @ApiBearerAuth()
  remove(@Param('id') id: number) {
    return this.roomService.remove(+id);
  }
}
