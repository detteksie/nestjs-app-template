import './global';
import { LogLevel } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { setupApp } from './setup-app';

async function bootstrap() {
  const logger: LogLevel[] =
    process.env.NODE_ENV === 'development'
      ? ['fatal', 'error', 'warn', 'log', 'debug', 'verbose']
      : ['fatal', 'error'];
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    cors: true,
    logger,
  });

  setupApp(app);

  const documentBuilder = new DocumentBuilder();
  const config = documentBuilder
    .setTitle('Nest Application')
    .setDescription('Template for Nest Application')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(helmet(), compression());

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
