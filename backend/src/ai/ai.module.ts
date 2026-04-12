import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';

import { QueryLog } from './entities/query-log.entity';
import { Subscription } from '../payments/entities/subscription.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AiGateway } from './gateway/ai.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([QueryLog, Subscription]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
      }),
    }),
  ],
  controllers: [AiController],
  providers: [AiService, AiGateway],
  exports: [AiService],
})
export class AiModule {}