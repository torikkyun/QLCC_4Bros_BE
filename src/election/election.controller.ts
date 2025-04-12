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
import { ElectionService } from './election.service';
import { CreateElectionDto } from './dto/create-election.dto';
import { UpdateElectionDto } from './dto/update-election.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ElectionPaginationDto } from './dto/election-pagination.dto';

@Controller('api/election')
@ApiTags('election')
export class ElectionController {
  constructor(private readonly electionService: ElectionService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager')
  @ApiBearerAuth()
  create(@Body() createElectionDto: CreateElectionDto) {
    return this.electionService.create(createElectionDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  findAll(@Query() electionPaginationDto: ElectionPaginationDto) {
    return this.electionService.findAll(electionPaginationDto);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  findOne(@Param('id') id: number) {
    return this.electionService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager')
  @ApiBearerAuth()
  update(
    @Param('id') id: number,
    @Body() updateElectionDto: UpdateElectionDto,
  ) {
    return this.electionService.update(+id, updateElectionDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager')
  @ApiBearerAuth()
  remove(@Param('id') id: number) {
    return this.electionService.remove(+id);
  }
}
