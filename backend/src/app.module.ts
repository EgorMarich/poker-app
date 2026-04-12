import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import { AuthModule } from './auth/auth.module';
import { RangesModule } from './ranges/ranges.module';
import { AiModule } from './ai/ai.module';
import { SessionsModule } from './sessions/sessions.module';
import { AdminModule } from './admin/admin.module';
import { PaymentsModule } from './payments/payments.module';

import { User } from './users/entities/user.entity';
import { Range } from './ranges/entities/range.entity';
import { Session } from './sessions/entities/session.entity';
import { QueryLog } from './ai/entities/query-log.entity';
import { Subscription } from './payments/entities/subscription.entity';
import { RolesGuard } from './guards/roles.guard';
import { Payment } from './payments/entities/payments.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { TransformInterceptor } from './interceptors/transform.interceptors';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { TrainingModule } from './training/training.module';
import { TrainingScenario } from './training/entities/training-scenario.entity';
import { TrainingAttempt } from './training/entities/training-attempt.entity';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [User, Range, Session, QueryLog, Subscription, Payment, TrainingScenario,TrainingAttempt],
        synchronize: config.get<string>('NODE_ENV') === 'development', 
        logging: config.get<string>('NODE_ENV') === 'development',
        ssl:
          config.get<string>('NODE_ENV') === 'production'
            ? { rejectUnauthorized: false }
            : false,
      }),
    }),

    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get<number>('THROTTLE_TTL', 60) * 1000,
          limit: config.get<number>('THROTTLE_LIMIT', 100),
        },
      ],
    }),

    TrainingModule,
    AuthModule,
    RangesModule,
    AiModule,
    SessionsModule,
    AdminModule,
    PaymentsModule,
  ],
  providers: [
    // Global throttle guard
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // Global JWT guard (routes opt-out with @Public())
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // Global roles guard
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    // Global interceptors
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}