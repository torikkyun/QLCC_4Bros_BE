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
  UseFilters,
  ValidationPipe,
} from '@nestjs/common';
import { CandidateService } from './candidate.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CandidatePaginationDto } from './dto/candidate-pagination.dto';
import { HttpExceptionFilter } from 'src/common/filter/http-exception.filter';
import { UserExistsPipe } from 'src/common/pipes/user-exist.pipe';

@Controller('api/candidate')
@ApiTags('candidate')
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager')
  @UseFilters(HttpExceptionFilter)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin' })
  create(
    @Body(ValidationPipe, UserExistsPipe)
    createCandidateDto: CreateCandidateDto,
  ) {
    return this.candidateService.create(createCandidateDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @UseFilters(HttpExceptionFilter)
  @ApiBearerAuth()
  findAll(
    @Query(ValidationPipe) candidatePaginationDto: CandidatePaginationDto,
  ) {
    return this.candidateService.findAll(candidatePaginationDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @UseFilters(HttpExceptionFilter)
  @ApiBearerAuth()
  findById(@Param('id') id: number) {
    return this.candidateService.findById(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager')
  @UseFilters(HttpExceptionFilter)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin' })
  update(
    @Param('id') id: string,
    @Body() updateCandidateDto: UpdateCandidateDto,
  ) {
    return this.candidateService.update(+id, updateCandidateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager')
  @UseFilters(HttpExceptionFilter)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin' })
  remove(@Param('id') id: string) {
    return this.candidateService.remove(+id);
  }
}
