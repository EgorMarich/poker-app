import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  UseGuards,
  Headers,
  RawBodyRequest,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { SubscriptionPlan } from './entities/subscription.entity';
import { User } from '../users/entities/user.entity';
import { Public } from '@/decorators/public.decorator';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';

class CreatePaymentDto {
  @ApiProperty({ enum: SubscriptionPlan })
  @IsEnum(SubscriptionPlan)
  plan: SubscriptionPlan;
}

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Get('subscription')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current subscription info' })
  getSubscription(@CurrentUser() user: User) {
    return this.paymentsService.getSubscription(user.id);
  }

  @Post('create')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a payment to upgrade subscription' })
  createPayment(@CurrentUser() user: User, @Body() dto: CreatePaymentDto) {
    return this.paymentsService.createPayment(user.id, dto.plan);
  }

  @Get('history')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get payment history' })
  getHistory(@CurrentUser() user: User) {
    return this.paymentsService.getPaymentHistory(user.id);
  }

  @Delete('subscription')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cancel subscription (at expiry)' })
  cancelSubscription(@CurrentUser() user: User) {
    return this.paymentsService.cancelSubscription(user.id);
  }

  @Post('webhook/yookassa')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'YooKassa webhook endpoint' })
  async handleYooKassaWebhook(@Req() req: any, @Body() body: any) {
    // In production: validate webhook signature
    await this.paymentsService.handleWebhook(body);
    return { ok: true };
  }
}