import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { TrainingScenario, Difficulty } from './entities/training-scenario.entity'
import { TrainingAttempt } from './entities/training-attempt.entity'
import { Subscription, SubscriptionPlan } from '../payments/entities/subscription.entity'

const FREE_DAILY_ATTEMPTS = 10

@Injectable()
export class TrainingService {
  constructor(
    @InjectRepository(TrainingScenario)
    private scenarioRepo: Repository<TrainingScenario>,
    @InjectRepository(TrainingAttempt)
    private attemptRepo: Repository<TrainingAttempt>,
    @InjectRepository(Subscription)
    private subscriptionRepo: Repository<Subscription>,
  ) {}

  async getScenarios(userId: string, difficulty?: Difficulty) {
    const subscription = await this.subscriptionRepo.findOne({ where: { userId } })
    const isPaid = subscription?.plan !== SubscriptionPlan.FREE

    const query = this.scenarioRepo.createQueryBuilder('s')
      .where('s.isActive = true')
      .orderBy('s.sortOrder', 'ASC')

    if (difficulty) query.andWhere('s.difficulty = :difficulty', { difficulty })

    // Бесплатным — только isFree сценарии
    if (!isPaid) query.andWhere('s.isFree = true')

    const scenarios = await query.getMany()

    // Скрываем правильный ответ — отдаём только на фронт после попытки
    return scenarios.map(s => ({
      ...s,
      options: s.options.map(o => ({ id: o.id, label: o.label })), // без isCorrect!
      explanation: undefined, // скрываем до ответа
    }))
  }

  async submitAttempt(
    userId: string,
    scenarioId: string,
    selectedOptionId: string,
    timeSpentSec?: number,
  ) {
    // Проверяем лимит для бесплатных
    const subscription = await this.subscriptionRepo.findOne({ where: { userId } })
    const isPaid = subscription?.plan !== SubscriptionPlan.FREE

    if (!isPaid) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const todayAttempts = await this.attemptRepo.count({
        where: { userId, createdAt: today as any },
      })

      if (todayAttempts >= FREE_DAILY_ATTEMPTS) {
        throw new ForbiddenException({
          message: `Бесплатный лимит ${FREE_DAILY_ATTEMPTS} попыток в день исчерпан`,
          code: 'TRAINING_LIMIT_EXCEEDED',
          upgradeRequired: true,
        })
      }
    }

    const scenario = await this.scenarioRepo.findOne({ where: { id: scenarioId } })
    if (!scenario) throw new NotFoundException('Scenario not found')

    const correctOption = scenario.options.find(o => o.isCorrect)
    const isCorrect = correctOption?.id === selectedOptionId

    const attempt = this.attemptRepo.create({
      userId,
      scenarioId,
      selectedOptionId,
      isCorrect,
      timeSpentSec,
    })
    await this.attemptRepo.save(attempt)

    return {
      isCorrect,
      correctOptionId: correctOption?.id,
      explanation: scenario.explanation,
    }
  }

  async getStats(userId: string) {
    const total = await this.attemptRepo.count({ where: { userId } })
    const correct = await this.attemptRepo.count({ where: { userId, isCorrect: true } })

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayCount = await this.attemptRepo.count({ where: { userId } })

    const subscription = await this.subscriptionRepo.findOne({ where: { userId } })
    const isPaid = subscription?.plan !== SubscriptionPlan.FREE

    return {
      total,
      correct,
      accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
      todayAttempts: todayCount,
      dailyLimit: isPaid ? null : FREE_DAILY_ATTEMPTS,
      canAttempt: isPaid || todayCount < FREE_DAILY_ATTEMPTS,
    }
  }
}