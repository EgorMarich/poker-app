import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { seedTraining } from './training/training.seed';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');


  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://tkh1wct9-5173.euw.devtunnels.ms',
      /\.devtunnels\.ms$/,
    ],
    credentials: true,
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

  const dataSource = app.get(DataSource)
  await seedTraining(dataSource)

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 App running on http://localhost:${port}`);
  console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
}

bootstrap();
