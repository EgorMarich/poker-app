import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum SubscriptionPlan {
  FREE = 'free',
  BASIC = 'basic',
  PRO = 'pro',
  UNLIMITED = 'unlimited',
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  PENDING = 'pending',
}

export const PLAN_LIMITS = {
  [SubscriptionPlan.FREE]: {
    maxRanges: 3,
    dailyAiQuota: 5,
    monthlyAiQuota: 50,
    canExportRanges: false,
    canAccessHistory: false,
  },
  [SubscriptionPlan.BASIC]: {
    maxRanges: 20,
    dailyAiQuota: 30,
    monthlyAiQuota: 300,
    canExportRanges: true,
    canAccessHistory: true,
  },
  [SubscriptionPlan.PRO]: {
    maxRanges: 100,
    dailyAiQuota: 100,
    monthlyAiQuota: 1500,
    canExportRanges: true,
    canAccessHistory: true,
  },
  [SubscriptionPlan.UNLIMITED]: {
    maxRanges: -1,
    dailyAiQuota: -1,
    monthlyAiQuota: -1,
    canExportRanges: true,
    canAccessHistory: true,
  },
};

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.subscription)
  @JoinColumn()
  user: User;

  @Column()
  userId: string;

  @Column({
    type: 'enum',
    enum: SubscriptionPlan,
    default: SubscriptionPlan.FREE,
  })
  plan: SubscriptionPlan;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.ACTIVE,
  })
  status: SubscriptionStatus;

  @Column({ default: 3 })
  maxRanges: number;

  @Column({ default: 5 })
  dailyAiQuota: number;

  @Column({ default: 50 })
  monthlyAiQuota: number;

  // Usage counters
  @Column({ default: 0 })
  dailyAiUsed: number;

  @Column({ default: 0 })
  monthlyAiUsed: number;

  // Reset timestamps
  @Column({ type: 'timestamp', nullable: true })
  dailyResetAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  monthlyResetAt: Date;

  // Subscription period
  @Column({ type: 'timestamp', nullable: true })
  startsAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @Column({ nullable: true })
  externalSubscriptionId: string;

  @Column({ nullable: true })
  lastPaymentId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
