import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ElectionDetailService } from './election-detail.service';
import { CreateElectionDetailDto } from './dto/create-election-detail.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ElectionDetailPaginationDto } from './dto/election-detail-pagination.dto';

@Controller('election-detail')
export class ElectionDetailController {
  constructor(private readonly electionDetailService: ElectionDetailService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin' })
  create(@Body() createElectionDetailDto: CreateElectionDetailDto) {
    return this.electionDetailService.createMany(createElectionDetailDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findAll(@Query() electionDetailPaginationDto: ElectionDetailPaginationDto) {
    return this.electionDetailService.findAll(electionDetailPaginationDto);
  }

  @Delete(':electionId/:candidateId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin' })
  remove(
    @Param('electionId', ParseIntPipe) electionId: number,
    @Param('candidateId', ParseIntPipe) candidateId: number,
  ) {
    return this.electionDetailService.remove(electionId, candidateId);
  }
}
