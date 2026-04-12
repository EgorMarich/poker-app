import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum GameType {
  NLH = 'NLH', // No Limit Hold'em
  PLO = 'PLO', // Pot Limit Omaha
  PLO5 = 'PLO5',
  MTT = 'MTT',
  SNG = 'SNG',
  CASH = 'CASH',
}

export enum SessionStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned',
}

export interface HandNote {
  handNumber?: number;
  position?: string;
  action?: string;
  potSize?: number;
  result?: number;
  notes?: string;
  timestamp?: string;
}

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.sessions, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column()
  userId: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: GameType, default: GameType.CASH })
  gameType: GameType;

  @Column({ type: 'enum', enum: SessionStatus, default: SessionStatus.ACTIVE })
  status: SessionStatus;

  // Stakes (e.g. 1/2, 2/5)
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  smallBlind: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  bigBlind: number;

  // Financial results
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  buyIn: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  cashOut: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    generatedType: 'STORED',
    asExpression: '"cashOut" - "buyIn"',
    nullable: true,
  })
  profit: number;

  // Duration
  @Column({ type: 'timestamp', nullable: true })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  endedAt: Date;

  // Location / platform
  @Column({ nullable: true })
  venue: string; // e.g. "PokerStars", "Live - Casino Name"

  // Notes and hand history
  @Column({ type: 'jsonb', default: [] })
  handNotes: HandNote[];

  @Column({ type: 'text', nullable: true })
  generalNotes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}