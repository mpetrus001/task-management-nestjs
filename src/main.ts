import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: /localhost/,
      exposedHeaders: ['Content-Range'],
      credentials: true,
    },
  });

  const port = 3000;
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
  // TODO fix this so that it only shows when running in container
  if (process.env.API_PORT && process.env.NODE_ENV === 'production') {
    logger.log(`Application exposed on port ${process.env.API_PORT}`);
  }
}
bootstrap();
