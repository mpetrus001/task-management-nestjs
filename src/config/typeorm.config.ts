import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// TODO implement environment variables
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'nestjs-admin',
  password: 'admin-nestjs',
  database: 'task-management-db',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
};
