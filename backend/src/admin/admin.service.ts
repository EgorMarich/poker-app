import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import { Range } from '../ranges/entities/range.entity';
import { Session } from '../sessions/entities/session.entity';
import { QueryLog } from '../ai/entities/query-log.entity';

import {
  Subscription,
  SubscriptionPlan,
  PLAN_LIMITS,
} from '../payments/entities/subscription.entity';
import { Payment } from '@/payments/entities/payments.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Range)
    private rangeRepository: Repository<Range>,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    @InjectRepository(QueryLog)
    private queryLogRepository: Repository<QueryLog>,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
  ) {}

  async getUsers(page = 1, limit = 20) {
    const [users, total] = await this.userRepository.findAndCount({
      relations: ['subscription'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      users: users.map(({ password, ...u }) => u),
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async setUserRole(userId: string, role: UserRole) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    user.role = role;
    await this.userRepository.save(user);
    return { message: `Role updated to ${role}`, userId };
  }

  async setUserActive(userId: string, isActive: boolean) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    user.isActive = isActive;
    await this.userRepository.save(user);
    return { message: `User ${isActive ? 'activated' : 'deactivated'}` };
  }

  async manuallySetPlan(userId: string, plan: SubscriptionPlan) {
    const subscription = await this.subscriptionRepository.findOne({
      where: { userId },
    });
    if (!subscription) throw new NotFoundException('Subscription not found');

    const limits = PLAN_LIMITS[plan];
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    Object.assign(subscription, {
      plan,
      maxRanges: limits.maxRanges,
      dailyAiQuota: limits.dailyAiQuota,
      monthlyAiQuota: limits.monthlyAiQuota,
      startsAt: now,
      expiresAt,
    });

    await this.subscriptionRepository.save(subscription);
    return { message: `Plan set to ${plan}`, userId };
  }

  async getStats() {
    const [totalUsers, activeUsers, totalRanges, totalSessions] =
      await Promise.all([
        this.userRepository.count(),
        this.userRepository.count({ where: { isActive: true } }),
        this.rangeRepository.count(),
        this.sessionRepository.count(),
      ]);

    const totalAiQueries = await this.queryLogRepository.count();

    const totalRevenue = await this.paymentRepository
      .createQueryBuilder('p')
      .select('SUM(p.amount)', 'total')
      .where('p.status = :status', { status: 'succeeded' })
      .getRawOne();

    const planDistribution = await this.subscriptionRepository
      .createQueryBuilder('s')
      .select('s.plan', 'plan')
      .addSelect('COUNT(*)', 'count')
      .groupBy('s.plan')
      .getRawMany();

    const recentSignups = await this.userRepository.find({
      order: { createdAt: 'DESC' },
      take: 5,
      select: ['id', 'email', 'firstName', 'telegramUsername', 'createdAt'],
    });

    return {
      users: { total: totalUsers, active: activeUsers },
      ranges: { total: totalRanges },
      sessions: { total: totalSessions },
      aiQueries: { total: totalAiQueries },
      revenue: {
        total: parseFloat(totalRevenue?.total ?? '0'),
        currency: 'RUB',
      },
      planDistribution,
      recentSignups,
    };
  }
}
