import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RangesController } from './ranges.controller';
import { Range } from './entities/range.entity';
import { Subscription } from '../payments/entities/subscription.entity';
import { RangesService } from './ranges.service';

@Module({
  imports: [TypeOrmModule.forFeature([Range, Subscription])],
  controllers: [RangesController],
  providers: [RangesService],
  exports: [RangesService],
})
export class RangesModule {}