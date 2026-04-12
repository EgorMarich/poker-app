import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import {
  Subscription,
  SubscriptionPlan,
  SubscriptionStatus,
  PLAN_LIMITS,
} from './entities/subscription.entity';
import {
  Payment,
  PaymentProvider,
  PaymentStatus,
} from './entities/payments.entity';

const PLAN_PRICES = {
  [SubscriptionPlan.BASIC]: { amount: '499.00', currency: 'RUB', months: 1 },
  [SubscriptionPlan.PRO]: { amount: '999.00', currency: 'RUB', months: 1 },
  [SubscriptionPlan.UNLIMITED]: {
    amount: '1999.00',
    currency: 'RUB',
    months: 1,
  },
};

const PLAN_NAMES = {
  [SubscriptionPlan.BASIC]: 'Basic план (30 дней)',
  [SubscriptionPlan.PRO]: 'Pro план (30 дней)',
  [SubscriptionPlan.UNLIMITED]: 'Unlimited план (30 дней)',
};

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly yooKassaBase = 'https://api.yookassa.ru/v3';

  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    private configService: ConfigService,
  ) {}

  async createPayment(userId: string, plan: SubscriptionPlan) {
    if (plan === SubscriptionPlan.FREE) {
      throw new BadRequestException('Cannot pay for free plan');
    }

    const isTestMode =
      this.configService.get<string>('PAYMENT_TEST_MODE') === 'true';

    // Тестовый режим — сразу активируем подписку без ЮКассы
    if (isTestMode) {
      const payment = this.paymentRepository.create({
        userId,
        provider: PaymentProvider.YOOKASSA,
        externalId: `test_${Date.now()}`,
        amount: parseFloat(PLAN_PRICES[plan].amount),
        currency: PLAN_PRICES[plan].currency,
        status: PaymentStatus.SUCCEEDED,
        plan,
        durationMonths: 1,
        description: `[TEST] ${PLAN_NAMES[plan]}`,
        paidAt: new Date(),
      });
      await this.paymentRepository.save(payment);
      await this.handlePaymentSucceeded(payment, {});

      return {
        paymentId: payment.id,
        confirmationUrl: null,
        testMode: true,
        amount: PLAN_PRICES[plan].amount,
        currency: PLAN_PRICES[plan].currency,
        plan,
      };
    }

    const planPrice = PLAN_PRICES[plan];
    if (!planPrice) throw new BadRequestException('Invalid plan');

    const idempotenceKey = uuidv4();
    const returnUrl = this.configService.get<string>('YOOKASSA_RETURN_URL');

    try {
      const response = await axios.post(
        `${this.yooKassaBase}/payments`,
        {
          amount: {
            value: planPrice.amount,
            currency: planPrice.currency,
          },
          capture: true,
          confirmation: {
            type: 'redirect',
            return_url: `${returnUrl}?plan=${plan}`,
          },
          description: PLAN_NAMES[plan],
          metadata: { userId, plan },
        },
        {
          auth: {
            username: this.configService.get<string>('YOOKASSA_SHOP_ID'),
            password: this.configService.get<string>('YOOKASSA_SECRET_KEY'),
          },
          headers: {
            'Idempotence-Key': idempotenceKey,
            'Content-Type': 'application/json',
          },
        },
      );

      const ykPayment = response.data;

      // Save payment record
      const payment = this.paymentRepository.create({
        userId,
        provider: PaymentProvider.YOOKASSA,
        externalId: ykPayment.id,
        amount: parseFloat(planPrice.amount),
        currency: planPrice.currency,
        status: PaymentStatus.PENDING,
        plan,
        durationMonths: planPrice.months,
        description: PLAN_NAMES[plan],
        rawPayload: ykPayment,
      });
      await this.paymentRepository.save(payment);

      return {
        paymentId: payment.id,
        confirmationUrl: ykPayment.confirmation?.confirmation_url,
        amount: planPrice.amount,
        currency: planPrice.currency,
        plan,
      };
    } catch (error) {
      this.logger.error(
        'YooKassa payment creation failed',
        error.response?.data || error.message,
      );
      throw new BadRequestException('Payment creation failed');
    }
  }

  async handleWebhook(payload: any) {
    const event = payload.event;
    const ykPayment = payload.object;

    if (!ykPayment?.id) {
      this.logger.warn('Invalid webhook payload received');
      return;
    }

    const payment = await this.paymentRepository.findOne({
      where: { externalId: ykPayment.id },
    });

    if (!payment) {
      this.logger.warn(`Payment not found for external ID: ${ykPayment.id}`);
      return;
    }

    if (event === 'payment.succeeded') {
      await this.handlePaymentSucceeded(payment, ykPayment);
    } else if (event === 'payment.canceled') {
      payment.status = PaymentStatus.CANCELLED;
      payment.rawPayload = ykPayment;
      await this.paymentRepository.save(payment);
    }
  }

  private async handlePaymentSucceeded(payment: Payment, ykPayment: any) {
    payment.status = PaymentStatus.SUCCEEDED;
    payment.paidAt = new Date();
    payment.rawPayload = ykPayment;
    await this.paymentRepository.save(payment);

    // Activate subscription
    const subscription = await this.subscriptionRepository.findOne({
      where: { userId: payment.userId },
    });

    if (!subscription) {
      this.logger.error(`Subscription not found for user ${payment.userId}`);
      return;
    }

    const limits = PLAN_LIMITS[payment.plan];
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setMonth(expiresAt.getMonth() + payment.durationMonths);

    subscription.plan = payment.plan;
    subscription.status = SubscriptionStatus.ACTIVE;
    subscription.maxRanges = limits.maxRanges;
    subscription.dailyAiQuota = limits.dailyAiQuota;
    subscription.monthlyAiQuota = limits.monthlyAiQuota;
    subscription.startsAt = now;
    subscription.expiresAt = expiresAt;
    subscription.lastPaymentId = payment.id;

    await this.subscriptionRepository.save(subscription);
    this.logger.log(
      `Subscription upgraded: user=${payment.userId} plan=${payment.plan}`,
    );
  }

  async getPaymentHistory(userId: string) {
    return this.paymentRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      select: [
        'id',
        'amount',
        'currency',
        'status',
        'plan',
        'description',
        'paidAt',
        'createdAt',
      ],
    });
  }

  async getSubscription(userId: string) {
    const subscription = await this.subscriptionRepository.findOne({
      where: { userId },
    });
    if (!subscription) throw new NotFoundException('Subscription not found');
    return subscription;
  }

  async cancelSubscription(userId: string) {
    const subscription = await this.subscriptionRepository.findOne({
      where: { userId },
    });
    if (!subscription) throw new NotFoundException('Subscription not found');

    // Downgrade to free at expiry - just mark as cancelled
    subscription.status = SubscriptionStatus.CANCELLED;
    await this.subscriptionRepository.save(subscription);

    return {
      message: 'Subscription will be cancelled at expiry date',
      expiresAt: subscription.expiresAt,
    };
  }
}
