import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

export enum ScenarioType {
  QUIZ = 'quiz',
  ACTION = 'action',
  RANGE = 'range',
}

export enum Difficulty {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export interface ScenarioOption {
  id: string        // 'a' | 'b' | 'c' | 'd'
  label: string     // 'Fold' | 'Call' | 'Raise 3x'
  isCorrect: boolean
}

@Entity('training_scenarios')
export class TrainingScenario {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'enum', enum: ScenarioType })
  type: ScenarioType

  @Column({ type: 'enum', enum: Difficulty, default: Difficulty.BEGINNER })
  difficulty: Difficulty

  @Column()
  title: string

  @Column({ type: 'text' })
  description: string

  @Column({ type: 'jsonb', default: [] })
  playerCards: string[]

  @Column({ type: 'jsonb', default: [] })
  boardCards: string[]

  @Column({ nullable: true })
  position: string

  @Column({ type: 'jsonb', default: [] })
  options: ScenarioOption[]

  @Column({ type: 'text' })
  explanation: string

  @Column({ default: false })
  isFree: boolean

  @Column({ default: 0 })
  sortOrder: number

  @Column({ default: true })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date
}