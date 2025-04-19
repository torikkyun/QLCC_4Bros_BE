import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseFilters,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserPaginationDto } from './dto/user-pagination.dto';
import { UserExistsPipe } from 'src/common/pipes/user-exist.pipe';
import { HttpExceptionFilter } from 'src/common/filter/http-exception.filter';

@Controller('api/user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(@Query() userPaginationDto: UserPaginationDto) {
    return this.userService.findAll(userPaginationDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @UseFilters(HttpExceptionFilter)
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
  })
  findById(@Param('id', ParseIntPipe, UserExistsPipe) id: number) {
    return this.userService.findById(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseFilters(HttpExceptionFilter)
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
  })
  update(
    @Param('id', ParseIntPipe, UserExistsPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(+id, updateUserDto);
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
  @ApiOperation({
    summary: 'admin',
  })
  remove(@Param('id') id: number) {
    return this.userService.remove(+id);
  }
}
