import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import * as helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: [/localhost/, /petrusprojects/],
    exposedHeaders: ['Content-Range'],
    credentials: true,
  });
  app.use(helmet());

  const port = 3000;
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}

bootstrap();
