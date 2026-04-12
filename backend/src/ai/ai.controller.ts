import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AiService } from './ai.service';
import { AiAdviceDto } from './dto/ai.dto';


import { User } from '../users/entities/user.entity';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';

@ApiTags('AI')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('advice')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get AI poker advice' })
  @ApiResponse({ status: 200, description: 'AI advice returned' })
  @ApiResponse({ status: 403, description: 'Quota exceeded - upgrade required' })
  @ApiResponse({ status: 503, description: 'AI service unavailable' })
  getAdvice(@CurrentUser() user: User, @Body() dto: AiAdviceDto) {
    return this.aiService.getAdvice(user.id, dto);
  }

  @Get('quota')
  @ApiOperation({ summary: 'Get AI query quota for current user' })
  getQuota(@CurrentUser() user: User) {
    return this.aiService.getQuota(user.id);
  }
}