import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsController } from './payments.controller';

import { Subscription } from './entities/subscription.entity';
import { Payment } from './entities/payments.entity';
import { PaymentsService } from './payments.service';
import { Referral } from '@/refferal/entities/refferal.entity';
import { ReferralModule } from '@/refferal/refferal.module';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Subscription, Referral]), ReferralModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}