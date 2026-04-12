import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { TrainingService } from './training.service'
import { User } from '../users/entities/user.entity'
import { Difficulty } from './entities/training-scenario.entity'
import { CurrentUser } from '@/decorators/current-user.decorator'
import { JwtAuthGuard } from '@/guards/jwt-auth.guard'

@ApiTags('Training')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('training')
export class TrainingController {
  constructor(private trainingService: TrainingService) {}

  @Get('scenarios')
  @ApiOperation({ summary: 'Get training scenarios' })
  getScenarios(
    @CurrentUser() user: User,
    @Query('difficulty') difficulty?: Difficulty,
  ) {
    return this.trainingService.getScenarios(user.id, difficulty)
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get user training statistics' })
  getStats(@CurrentUser() user: User) {
    return this.trainingService.getStats(user.id)
  }

  @Post('attempt')
  @ApiOperation({ summary: 'Submit training attempt' })
  submitAttempt(
    @CurrentUser() user: User,
    @Body() body: { scenarioId: string; selectedOptionId: string; timeSpentSec?: number },
  ) {
    return this.trainingService.submitAttempt(
      user.id,
      body.scenarioId,
      body.selectedOptionId,
      body.timeSpentSec,
    )
  }
}