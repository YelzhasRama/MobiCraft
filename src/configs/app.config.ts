import { configDotenv } from 'dotenv';

configDotenv();

export enum AppEnvironment {
  Local = 'local',
  Development = 'development',
  Production = 'production',
}

export const getAppConfig = () => {
  return {
    port: +process.env.APP_PORT || 3002,
    environment: process.env.APP_ENV || AppEnvironment.Production,
  };
};
