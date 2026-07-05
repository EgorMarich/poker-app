import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { seedTraining } from './training/training.seed';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  const corsOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim())
    : ['http://localhost:5173', 'http://localhost:3000'];

  const parsedOrigins = corsOrigins.map((origin) => {
    if (origin.includes('*')) {
      const pattern = origin.replace(/\./g, '\\.').replace(/\*/g, '.*');
      return new RegExp(`^${pattern}$`);
    }
    return origin;
  });

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      const isAllowed = parsedOrigins.some((allowed) => {
        if (typeof allowed === 'string') {
          return origin === allowed;
        }
        if (allowed instanceof RegExp) {
          return allowed.test(origin);
        }
        return false;
      });

      if (isAllowed) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked: ${origin}`);
        callback(new Error(`CORS origin ${origin} not allowed`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'X-Requested-With',
    ],
    exposedHeaders: ['Authorization'],
    maxAge: 864000,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const config = new DocumentBuilder()
    .setTitle('Poker App API')
    .setDescription('Backend API for Poker Range Manager with AI coaching')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth', 'Authentication & user profile')
    .addTag('Ranges', 'Poker hand range management')
    .addTag('AI', 'AI poker coach')
    .addTag('Sessions', 'Game session tracking')
    .addTag('Payments', 'Subscription & payments (YooKassa)')
    .addTag('Admin', 'Admin panel (admin role required)')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const dataSource = app.get(DataSource);
  await seedTraining(dataSource);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 App running on http://localhost:${port}`);
  console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
}

bootstrap();
