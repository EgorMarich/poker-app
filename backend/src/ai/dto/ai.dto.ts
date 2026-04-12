import {
  IsString,
  IsOptional,
  IsEnum,
  IsObject,
  MaxLength,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum GameStreet {
  PREFLOP = 'preflop',
  FLOP = 'flop',
  TURN = 'turn',
  RIVER = 'river',
}

export class AiAdviceDto {
  @ApiProperty({
    example: 'I have AKo on BTN vs UTG open. Should I 3-bet or call?',
    maxLength: 1000,
  })
  @IsString()
  @MaxLength(1000)
  prompt: string;

  @ApiPropertyOptional({ enum: GameStreet })
  @IsOptional()
  @IsEnum(GameStreet)
  street?: GameStreet;

  @ApiPropertyOptional({
    description: 'Current game context',
    example: {
      position: 'BTN',
      hand: 'AKo',
      pot: 150,
      stackSize: 1000,
      opponents: 1,
      previousActions: ['UTG raised 3x'],
    },
  })
  @IsOptional()
  @IsObject()
  context?: {
    position?: string;
    hand?: string;
    board?: string;
    pot?: number;
    stackSize?: number;
    opponents?: number;
    previousActions?: string[];
    rangeId?: string;
  };
}

export class AiQuotaResponseDto {
  plan: string;
  dailyUsed: number;
  dailyLimit: number;
  monthlyUsed: number;
  monthlyLimit: number;
  isUnlimited: boolean;
  canQuery: boolean;
  resetsAt: Date;
}