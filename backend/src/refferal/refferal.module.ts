import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../users/entities/user.entity';
import { Subscription } from '../payments/entities/subscription.entity';
import { ReferralService } from './refferal.service';
import { Referral } from './entities/refferal.entity';
import { ReferralController } from './refferal.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Referral, User, Subscription])],
  controllers: [ReferralController],
  providers: [ReferralService],
  exports: [ReferralService],
})
export class ReferralModule {}
