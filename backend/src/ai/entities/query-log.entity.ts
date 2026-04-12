import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum QueryStatus {
  SUCCESS = 'success',
  ERROR = 'error',
  QUOTA_EXCEEDED = 'quota_exceeded',
}

@Entity('query_logs')
export class QueryLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.queryLogs, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column()
  userId: string;

  // What was asked
  @Column({ type: 'text' })
  prompt: string;

  // Summarized context sent to AI
  @Column({ type: 'jsonb', nullable: true })
  context: Record<string, any>;

  // AI response (truncated for storage)
  @Column({ type: 'text', nullable: true })
  response: string;

  @Column({
    type: 'enum',
    enum: QueryStatus,
    default: QueryStatus.SUCCESS,
  })
  status: QueryStatus;

  // Token usage
  @Column({ default: 0 })
  promptTokens: number;

  @Column({ default: 0 })
  completionTokens: number;

  // Latency in ms
  @Column({ nullable: true })
  latencyMs: number;

  // AI model used
  @Column({ nullable: true })
  model: string;

  // Error info if failed
  @Column({ type: 'text', nullable: true })
  errorMessage: string;

  @CreateDateColumn()
  createdAt: Date;
}
