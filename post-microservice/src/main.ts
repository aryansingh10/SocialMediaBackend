import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'https://studio.apollographql.com',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3001);
  console.log('🚀 Server running at http://localhost:3001/graphql');
}
bootstrap();
