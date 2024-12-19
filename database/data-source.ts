import { DataSource, DataSourceOptions } from 'typeorm';
import { entities } from '../src/common/entities';
import { AppEnvironment, getAppConfig } from '../src/configs/app.config';
import { getDatabaseConfig } from '../src/configs/database.config';

const databaseConfig = getDatabaseConfig();
const appConfig = getAppConfig();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: databaseConfig.host,
  port: databaseConfig.port,
  username: databaseConfig.username,
  password: databaseConfig.password,
  database: databaseConfig.database,
  migrations:
    appConfig.environment === AppEnvironment.Local
      ? ['database/migrations/*.ts']
      : ['dist/database/migrations/*.js'],
  entities:
    appConfig.environment === AppEnvironment.Local
      ? entities
      : ['dist/src/common/entities/*.entity.js'],
  extra:
    appConfig.environment !== AppEnvironment.Local
      ? {
          ssl: {
            rejectUnauthorized: false,
          },
        }
      : undefined,
  ssl: appConfig.environment !== AppEnvironment.Local,
  synchronize: false,
};

export const dataSource = new DataSource(dataSourceOptions);
