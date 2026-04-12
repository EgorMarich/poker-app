import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TrainingService } from './training.service'
import { TrainingController } from './training.controller'
import { TrainingScenario } from './entities/training-scenario.entity'
import { TrainingAttempt } from './entities/training-attempt.entity'
import { Subscription } from '../payments/entities/subscription.entity'

@Module({
  imports: [TypeOrmModule.forFeature([TrainingScenario, TrainingAttempt, Subscription])],
  controllers: [TrainingController],
  providers: [TrainingService],
})
export class TrainingModule {}