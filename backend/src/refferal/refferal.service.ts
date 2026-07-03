//@ts-ignore

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { User } from '../users/entities/user.entity'
import { Subscription, SubscriptionPlan, SubscriptionStatus } from '../payments/entities/subscription.entity'
import { Referral, ReferralStatus } from './entities/refferal.entity'

@Injectable()
export class ReferralService {
  constructor(
    @InjectRepository(Referral)
    private referralRepo: Repository<Referral>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Subscription)
    private subscriptionRepo: Repository<Subscription>,
  ) {}

  async getOrCreatePromoCode(userId: string): Promise<string> {
    const user = await this.userRepo.findOne({ where: { id: userId } })
    if (!user) throw new NotFoundException('User not found')

    if (user?.promoCode) return user.promoCode

    const prefix = (user.firstName ?? user.telegramUsername ?? 'USER')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .substring(0, 4)

    const suffix = Math.random().toString(36).substring(2, 6).toUpperCase()
    const promoCode = `${prefix}${suffix}`

    user.promoCode = promoCode
    await this.userRepo.save(user)

    return promoCode
  }

  async applyPromoCode(refereeId: string, promoCode: string): Promise<string | null> {

    const referrer = await this.userRepo.findOne({
      where: { promoCode: promoCode.toUpperCase() },
    })

    if (!referrer) throw new BadRequestException('Промокод не найден')
    if (referrer.id === refereeId) throw new BadRequestException('Нельзя использовать свой промокод')


    const existing = await this.referralRepo.findOne({
      where: { refereeId },
    })
    if (existing) throw new BadRequestException('Вы уже использовали промокод')


    const referral = this.referralRepo.create({
      referrerId: referrer.id,
      refereeId,
      promoCode: promoCode.toUpperCase(),
      status: ReferralStatus.PENDING,
    })
    await this.referralRepo.save(referral)

    return referrer.id
  }

  async rewardReferrer(refereeId: string): Promise<void> {
    const referral = await this.referralRepo.findOne({
      where: { refereeId, status: ReferralStatus.PENDING },
    })

    if (!referral) return 

    const subscription = await this.subscriptionRepo.findOne({
      where: { userId: referral.referrerId },
    })

    if (!subscription) return

    const now = new Date()

    const baseDate =
      subscription.expiresAt && new Date(subscription.expiresAt) > now
        ? new Date(subscription.expiresAt)
        : now

    const newExpiry = new Date(baseDate)
    newExpiry.setMonth(newExpiry.getMonth() + 1)

    if (subscription.plan === SubscriptionPlan.FREE) {
      subscription.plan = SubscriptionPlan.BASIC
      subscription.maxRanges = 20
      subscription.dailyAiQuota = 30
      subscription.monthlyAiQuota = 300
      subscription.status = SubscriptionStatus.ACTIVE
    }

    subscription.expiresAt = newExpiry
    subscription.startsAt = subscription.startsAt ?? now
    await this.subscriptionRepo.save(subscription)

    referral.status = ReferralStatus.REWARDED
    referral.rewardedAt = now
    await this.referralRepo.save(referral)
  }

  async getStats(userId: string) {
    const promoCode = await this.getOrCreatePromoCode(userId)

    const referrals = await this.referralRepo.find({
      where: { referrerId: userId },
      order: { createdAt: 'DESC' },
    })

    const total = referrals.length
    const rewarded = referrals.filter(r => r.status === ReferralStatus.REWARDED).length
    const pending = total - rewarded

    return { promoCode, total, rewarded, pending }
  }
}