import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SessionsService, CreateSessionDto, UpdateSessionDto } from './sessions.service';


import { User } from '../users/entities/user.entity';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';

@ApiTags('Sessions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('sessions')
export class SessionsController {
  constructor(private sessionsService: SessionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all sessions for current user' })
  findAll(@CurrentUser() user: User) {
    return this.sessionsService.findAll(user.id);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get session statistics' })
  getStats(@CurrentUser() user: User) {
    return this.sessionsService.getStats(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific session' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.sessionsService.findOne(id, user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Start a new session' })
  create(@CurrentUser() user: User, @Body() dto: CreateSessionDto) {
    return this.sessionsService.create(user.id, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update session (add notes, finish session)' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
    @Body() dto: UpdateSessionDto,
  ) {
    return this.sessionsService.update(id, user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a session' })
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.sessionsService.remove(id, user.id);
  }
}