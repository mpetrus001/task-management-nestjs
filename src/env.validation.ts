import { Logger } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { IsEnum, IsString, validateSync } from 'class-validator';

const logger = new Logger('Bootstrap');

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsString()
  POSTGRES_USER: string;

  @IsString()
  POSTGRES_PASSWORD: string;

  @IsString()
  POSTGRES_DB: string;

  @IsString()
  JWT_SECRET: string;
}

export function validateENV(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  const { NODE_ENV, API_PORT, POSTGRES_USER, POSTGRES_DB } = config;

  logger.log(
    `Loaded ENV: ${JSON.stringify({
      NODE_ENV,
      API_PORT,
      POSTGRES_USER,
      POSTGRES_DB,
    })}`,
  );

  return validatedConfig;
}
