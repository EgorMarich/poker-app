import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { User } from '../../users/entities/user.entity'

@Entity('training_attempts')
export class TrainingAttempt {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User

  @Column()
  userId: string

  @Column()
  scenarioId: string

  @Column()
  selectedOptionId: string

  @Column()
  isCorrect: boolean

  @Column({ nullable: true })
  timeSpentSec: number

  @CreateDateColumn()
  createdAt: Date
}