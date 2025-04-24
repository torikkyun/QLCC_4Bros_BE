import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { VoteService } from './vote.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { User } from 'src/common/decorators/users.decorator';

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
}
