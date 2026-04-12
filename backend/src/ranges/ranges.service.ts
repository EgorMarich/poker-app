import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Range } from './entities/range.entity';
import { Subscription } from '../payments/entities/subscription.entity';
import { CreateRangeDto, UpdateRangeDto } from './dto/ranges.dto';


@Injectable()
export class RangesService {
  constructor(
    @InjectRepository(Range)
    private rangeRepository: Repository<Range>,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
  ) {}

  async findAll(userId: string) {
    return this.rangeRepository.find({
      where: { userId },
      order: { updatedAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string) {
    const range = await this.rangeRepository.findOne({
      where: { id, userId },
    });
    if (!range) throw new NotFoundException('Range not found');
    return range;
  }

  async create(userId: string, dto: CreateRangeDto) {
    // Check subscription limit
    const subscription = await this.subscriptionRepository.findOne({
      where: { userId },
    });

    if (!subscription) throw new ForbiddenException('No subscription found');

    // -1 means unlimited
    if (subscription.maxRanges !== -1) {
      const currentCount = await this.rangeRepository.count({
        where: { userId },
      });

      if (currentCount >= subscription.maxRanges) {
        throw new ForbiddenException({
          message: `Range limit reached (${subscription.maxRanges} max on your plan)`,
          code: 'RANGE_LIMIT_EXCEEDED',
          currentPlan: subscription.plan,
          limit: subscription.maxRanges,
          upgradeRequired: true,
        });
      }
    }

    const comboCount = this.calculateComboCount(dto.matrix);
    const range = this.rangeRepository.create({
      userId,
      ...dto,
      comboCount,
    });

    return this.rangeRepository.save(range);
  }

  async update(id: string, userId: string, dto: UpdateRangeDto) {
    const range = await this.findOne(id, userId);
    if (dto.matrix) {
      range.comboCount = this.calculateComboCount(dto.matrix);
    }
    Object.assign(range, dto);
    return this.rangeRepository.save(range);
  }

  async remove(id: string, userId: string) {
    const range = await this.findOne(id, userId);
    await this.rangeRepository.remove(range);
    return { message: 'Range deleted successfully' };
  }

  async getQuotaInfo(userId: string) {
    const subscription = await this.subscriptionRepository.findOne({
      where: { userId },
    });
    if (!subscription) throw new NotFoundException('Subscription not found');

    const currentCount = await this.rangeRepository.count({ where: { userId } });

    return {
      plan: subscription.plan,
      used: currentCount,
      limit: subscription.maxRanges,
      isUnlimited: subscription.maxRanges === -1,
      canCreate: subscription.maxRanges === -1 || currentCount < subscription.maxRanges,
    };
  }

  // Count combos in range matrix
  private calculateComboCount(matrix?: Record<string, any>): number {
    if (!matrix) return 0;
    const COMBO_COUNTS: Record<string, number> = {
      // Pocket pairs: 6 combos each
      AA: 6, KK: 6, QQ: 6, JJ: 6, TT: 6, '99': 6, '88': 6, '77': 6,
      '66': 6, '55': 6, '44': 6, '33': 6, '22': 6,
      // Suited hands: 4 combos each
      // Offsuit hands: 12 combos each
    };

    let total = 0;
    for (const [hand, action] of Object.entries(matrix)) {
      if (!action) continue;
      const isSuited = hand.endsWith('s');
      const isPair = hand.length === 2 && hand[0] === hand[1];
      const isOffsuit = hand.endsWith('o');

      let combos = isPair ? 6 : isSuited ? 4 : isOffsuit ? 12 : 0;

      if (typeof action === 'object' && action.raise !== undefined) {
        // Mixed strategy - partial combos
        total += combos * (action.raise + (action.call ?? 0));
      } else if (action !== 'fold' && action !== null) {
        total += combos;
      }
    }
    return Math.round(total * 100) / 100;
  }
}