import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'

export enum ReferralStatus {
  PENDING = 'pending',  
  REWARDED = 'rewarded',  
}

@Entity('referrals')
export class Referral {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  referrer: User

  @Column()
  referrerId: string

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  referee: User

  @Column()
  refereeId: string

  @Column()
  promoCode: string

  @Column({ type: 'enum', enum: ReferralStatus, default: ReferralStatus.PENDING })
  status: ReferralStatus

  @Column({ type: 'timestamp', nullable: true })
  rewardedAt: Date

  @CreateDateColumn()
  createdAt: Date
}