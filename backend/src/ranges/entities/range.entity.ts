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

export enum Position {
  UTG = 'UTG',
  UTG1 = 'UTG+1',
  UTG2 = 'UTG+2',
  MP = 'MP',
  HJ = 'HJ',
  CO = 'CO',
  BTN = 'BTN',
  SB = 'SB',
  BB = 'BB',
}

export enum ActionType {
  RAISE = 'raise',
  CALL = 'call',
  FOLD = 'fold',
  RERAISE = '3bet',
  OPEN = 'open',
}

export type HandAction = 'raise' | 'call' | 'fold' | 'mixed' | null;

export interface RangeMatrix {
  [hand: string]: HandAction | { raise: number; call: number; fold: number };
}

@Entity('ranges')
export class Range {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.ranges, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column()
  userId: string;

  @Column()
  name: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: Position, nullable: true })
  position: Position;

  @Column({ type: 'enum', enum: ActionType, nullable: true })
  actionType: ActionType;

  @Column({ type: 'jsonb', default: {} })
  matrix: RangeMatrix;

  @Column({ type: 'text', array: true, default: [] })
  tags: string[];

  @Column({ default: false })
  isPublic: boolean;

  @Column({ default: false })
  isTemplate: boolean;

  @Column({ type: 'float', default: 0 })
  comboCount: number; 

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}