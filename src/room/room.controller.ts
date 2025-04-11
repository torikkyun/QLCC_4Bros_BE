import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UpdateRoomDto } from './dto/update-room.dto';

@Controller('api/room')
@ApiTags('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager')
  @ApiBearerAuth()
  @ApiBody({
    type: CreateRoomDto,
  })
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.create(createRoomDto);
  }

  @Get()
  findAll() {
    return this.roomService.findAll();
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
  })
  findById(@Param('id') id: number) {
    return this.roomService.findById(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
  })
  @ApiBody({
    type: UpdateRoomDto,
  })
  update(@Param('id') id: number, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomService.update(+id, updateRoomDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
  })
  remove(@Param('id') id: number) {
    return this.roomService.remove(+id);
  }
}
