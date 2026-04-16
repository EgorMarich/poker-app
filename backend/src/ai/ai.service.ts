import {
  Injectable,
  ForbiddenException,
  ServiceUnavailableException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { QueryLog, QueryStatus } from './entities/query-log.entity';
import { Subscription } from '../payments/entities/subscription.entity';
import { AiAdviceDto } from './dto/ai.dto';
import { extractErrorDetails } from '@/common/utils/error.utils';

const POKER_SYSTEM_PROMPT = `Ты эксперт по покеру и GTO (Game Theory Optimal) консультант.
Давай краткие и практичные советы на основе современной покерной теории.
Всегда учитывай:
- Позицию (IP/OOP)
- SPR (стек к банку)
- Текстуру борда
- Преимущество диапазона
- Пот-оддсы и импайд-оддсы
Формат: сначала рекомендация, потом обоснование. Отвечай на русском.`;

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  private accessToken: string | null = null;
  private tokenExpiresAt: number = 0;

  constructor(
    @InjectRepository(QueryLog)
    private queryLogRepository: Repository<QueryLog>,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    private configService: ConfigService,
  ) {}

  private async getAccessToken(): Promise<string> {
    const now = Date.now();
    if (this.accessToken && now < this.tokenExpiresAt) {
      return this.accessToken;
    }

    const authKey = this.configService.get<string>('GIGACHAT_CLIENT_SECRET');
    const scope = this.configService.get<string>(
      'GIGACHAT_SCOPE',
      'GIGACHAT_API_PERS',
    );

    try {
      const { data } = await axios.post(
        'https://ngw.devices.sberbank.ru:9443/api/v2/oauth',
        new URLSearchParams({ scope }),
        {
          headers: {
            Authorization: `Basic ${authKey}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
            RqUID: uuidv4(),
          },
          httpsAgent: new (require('https').Agent)({
            rejectUnauthorized: false,
          }),
        },
      );

      this.accessToken = data.access_token;
      this.tokenExpiresAt = now + (data.expires_at - 30000);
      return this.accessToken;
    } catch (error) {
      const errorDetails = extractErrorDetails(error);

      this.logger.error('GigaChat OAuth error', {
        message: errorDetails.message,
        status: errorDetails.status,
        data: errorDetails.data,
      });

      throw new UnauthorizedException(
        `GigaChat auth failed: ${errorDetails.message}`,
      );
    }
  }

  async getAdvice(userId: string, dto: AiAdviceDto) {
    const subscription = await this.checkAndDecrementQuota(userId);

    const startTime = Date.now();
    const log = this.queryLogRepository.create({
      userId,
      prompt: dto.prompt,
      context: dto.context,
      status: QueryStatus.SUCCESS,
    });

    try {
      const token = await this.getAccessToken();

      const messages: { role: string; content: string }[] = [
        { role: 'system', content: POKER_SYSTEM_PROMPT },
      ];

      if (dto.context) {
        messages.push({
          role: 'user',
          content: this.formatContext(dto.context, dto.street),
        });
        messages.push({
          role: 'assistant',
          content: 'Понял ситуацию. Что хочешь узнать?',
        });
      }

      messages.push({ role: 'user', content: dto.prompt });

      const { data } = await axios.post(
        'https://gigachat.devices.sberbank.ru/api/v1/chat/completions',
        {
          model: this.configService.get<string>('GIGACHAT_MODEL', 'GigaChat'),
          messages,
          max_tokens: 600,
          temperature: 0.3,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          httpsAgent: new (require('https').Agent)({
            rejectUnauthorized: false,
          }),
        },
      );

      const answer = data.choices[0]?.message?.content ?? '';
      const usage = data.usage;

      log.response = answer;
      log.model = data.model;
      log.promptTokens = usage?.prompt_tokens ?? 0;
      log.completionTokens = usage?.completion_tokens ?? 0;
      log.latencyMs = Date.now() - startTime;

      await this.queryLogRepository.save(log);

      return {
        advice: answer,
        tokensUsed:
          (usage?.prompt_tokens ?? 0) + (usage?.completion_tokens ?? 0),
        quotaRemaining: this.getQuotaRemaining(subscription),
      };
    } catch (error) {
      const errorDetails = extractErrorDetails(error);
      this.logger.error('GigaChat OAuth error', {
        status: errorDetails.status,
        data: errorDetails.data,
        message: errorDetails.message,
      });
      throw new ServiceUnavailableException('AI auth failed');
    }
  }

  // ─── Остальные методы без изменений ──────────────────────────────────────

  async getQuota(userId: string) {
    const subscription = await this.subscriptionRepository.findOne({
      where: { userId },
    });
    if (!subscription) throw new ForbiddenException('No subscription found');

    await this.resetCountersIfNeeded(subscription);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    return {
      plan: subscription.plan,
      dailyUsed: subscription.dailyAiUsed,
      dailyLimit: subscription.dailyAiQuota,
      monthlyUsed: subscription.monthlyAiUsed,
      monthlyLimit: subscription.monthlyAiQuota,
      isUnlimited: subscription.dailyAiQuota === -1,
      canQuery:
        subscription.dailyAiQuota === -1 ||
        subscription.dailyAiUsed < subscription.dailyAiQuota,
      resetsAt: tomorrow,
    };
  }

  private async checkAndDecrementQuota(userId: string): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { userId },
    });
    if (!subscription) throw new ForbiddenException('No subscription found');

    await this.resetCountersIfNeeded(subscription);

    if (subscription.dailyAiQuota === -1) return subscription;

    if (subscription.dailyAiUsed >= subscription.dailyAiQuota) {
      throw new ForbiddenException({
        message: 'Daily AI quota exceeded',
        code: 'AI_QUOTA_EXCEEDED',
        currentPlan: subscription.plan,
        upgradeRequired: true,
      });
    }

    subscription.dailyAiUsed += 1;
    subscription.monthlyAiUsed += 1;
    await this.subscriptionRepository.save(subscription);
    return subscription;
  }

  private async resetCountersIfNeeded(subscription: Subscription) {
    const now = new Date();
    let dirty = false;

    if (
      !subscription.dailyResetAt ||
      this.isDifferentDay(subscription.dailyResetAt, now)
    ) {
      subscription.dailyAiUsed = 0;
      subscription.dailyResetAt = now;
      dirty = true;
    }

    if (
      !subscription.monthlyResetAt ||
      this.isDifferentMonth(subscription.monthlyResetAt, now)
    ) {
      subscription.monthlyAiUsed = 0;
      subscription.monthlyResetAt = now;
      dirty = true;
    }

    if (dirty) await this.subscriptionRepository.save(subscription);
  }

  private isDifferentDay(d1: Date, d2: Date) {
    return (
      d1.getFullYear() !== d2.getFullYear() ||
      d1.getMonth() !== d2.getMonth() ||
      d1.getDate() !== d2.getDate()
    );
  }

  private isDifferentMonth(d1: Date, d2: Date) {
    return (
      d1.getFullYear() !== d2.getFullYear() || d1.getMonth() !== d2.getMonth()
    );
  }

  private getQuotaRemaining(subscription: Subscription) {
    if (subscription.dailyAiQuota === -1) return null;
    return {
      daily: subscription.dailyAiQuota - subscription.dailyAiUsed,
      monthly: subscription.monthlyAiQuota - subscription.monthlyAiUsed,
    };
  }

  private formatContext(context: any, street?: string): string {
    const parts = ['Текущая игровая ситуация:'];
    if (street) parts.push(`Улица: ${street}`);
    if (context.position) parts.push(`Моя позиция: ${context.position}`);
    if (context.hand) parts.push(`Моя рука: ${context.hand}`);
    if (context.board) parts.push(`Борд: ${context.board}`);
    if (context.pot) parts.push(`Размер банка: ${context.pot} BB`);
    if (context.stackSize)
      parts.push(`Эффективный стек: ${context.stackSize} BB`);
    if (context.opponents) parts.push(`Оппонентов: ${context.opponents}`);
    if (context.previousActions?.length) {
      parts.push(`Действия до этого: ${context.previousActions.join(', ')}`);
    }
    return parts.join('\n');
  }
}
