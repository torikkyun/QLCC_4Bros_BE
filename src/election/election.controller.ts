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
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { ElectionService } from './election.service';
import { CreateElectionDto } from './dto/create-election.dto';
import { UpdateElectionDto } from './dto/update-election.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { ElectionPaginationDto } from './dto/election-pagination.dto';
import { UpdateElectionCandidateDto } from './dto/update-election-candidate.dto';

@Controller('api/election')
@ApiTags('election')
export class ElectionController {
  constructor(private readonly electionService: ElectionService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin' })
  create(@Body() createElectionDto: CreateElectionDto) {
    return this.electionService.create(createElectionDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findAll(@Query() electionPaginationDto: ElectionPaginationDto) {
    return this.electionService.findAll(electionPaginationDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.electionService.findById(+id);
  }

  @Get(':id/candidate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin' })
  getCandidatesForElection(@Param('id', ParseIntPipe) id: number) {
    return this.electionService.getCandidatesWithElectionStatus(id);
  }

  @Get(':id/results')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getElectionResults(@Param('id', ParseIntPipe) id: number) {
    return this.electionService.getElectionResults(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateElectionDto: UpdateElectionDto,
  ) {
    return this.electionService.update(+id, updateElectionDto);
  }

  @Put(':id/candidate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin' })
  updateCandidates(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateElectionCandidateDto: UpdateElectionCandidateDto,
  ) {
    return this.electionService.updateElectionCandidates(
      id,
      updateElectionCandidateDto.candidateIds,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.electionService.remove(+id);
  }
}
