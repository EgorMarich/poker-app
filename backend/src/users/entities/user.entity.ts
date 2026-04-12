import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Range } from '../../ranges/entities/range.entity';
import { Session } from '../../sessions/entities/session.entity';
import { QueryLog } from '../../ai/entities/query-log.entity';
import { Subscription } from '../../payments/entities/subscription.entity';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export enum AuthProvider {
  TELEGRAM = 'telegram',
  EMAIL = 'email',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;


  @Column({ nullable: true, unique: true, type: 'bigint' })
  telegramId: number;

  @Column({ nullable: true })
  telegramUsername: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  telegramPhotoUrl: string;

  @Column({ nullable: true, unique: true })
  email: string;

  @Column({ nullable: true })
  @Exclude()
  password: string;

  @Column({
    type: 'enum',
    enum: AuthProvider,
    default: AuthProvider.TELEGRAM,
  })
  authProvider: AuthProvider;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Range, (range) => range.user)
  ranges: Range[];

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  @OneToMany(() => QueryLog, (log) => log.user)
  queryLogs: QueryLog[];

  @OneToOne(() => Subscription, (sub) => sub.user, {
    cascade: true,
    eager: true,
  })
  subscription: Subscription;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
