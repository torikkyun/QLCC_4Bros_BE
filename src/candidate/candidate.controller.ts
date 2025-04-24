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
import { CandidateService } from './candidate.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CandidatePaginationDto } from './dto/candidate-pagination.dto';
import { User } from 'src/common/decorators/users.decorator';

@Controller('api/candidate')
@ApiTags('candidate')
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(
    @Body() createCandidateDto: CreateCandidateDto,
    @User() user: { id: number },
  ) {
    return this.candidateService.create(createCandidateDto, user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findAll(@Query() candidatePaginationDto: CandidatePaginationDto) {
    return this.candidateService.findAll(candidatePaginationDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findById(@Param('id') id: number) {
    return this.candidateService.findById(+id);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(
    @Body() updateCandidateDto: UpdateCandidateDto,
    @User() user: { id: number },
  ) {
    return this.candidateService.update(+user.id, updateCandidateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.candidateService.remove(+id);
  }
}
