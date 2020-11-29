import { Logger } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { IsString, validateSync } from 'class-validator';

const logger = new Logger('Bootstrap');

class EnvironmentVariables {
  @IsString()
  POSTGRES_HOST: string;

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

  logger.verbose('ENV config validated');

  return validatedConfig;
}
