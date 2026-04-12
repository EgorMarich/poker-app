import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { User } from '../users/entities/user.entity';
import { Range } from '../ranges/entities/range.entity';
import { Session } from '../sessions/entities/session.entity';
import { QueryLog } from '../ai/entities/query-log.entity';

import { Subscription } from '../payments/entities/subscription.entity';
import { Payment } from '@/payments/entities/payments.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Range, Session, QueryLog, Payment, Subscription]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}