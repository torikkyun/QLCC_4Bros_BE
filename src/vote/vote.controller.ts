import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { VoteService } from './vote.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { User } from 'src/common/decorators/users.decorator';
import { VotePaginationDto } from './dto/vote-pagination.dto';
import { RemoveVoteDto } from './dto/remove-vote.dto';

@Controller('api/vote')
@ApiTags('vote')
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Body() createVoteDto: CreateVoteDto, @User() user: { id: number }) {
    return this.voteService.create(createVoteDto, user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findAll(@Query() votePaginationDto: VotePaginationDto) {
    return this.voteService.findAll(votePaginationDto);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@Query() removeVoteDto: RemoveVoteDto, @User() user: { id: number }) {
    return this.voteService.remove(removeVoteDto, user.id);
  }
}
