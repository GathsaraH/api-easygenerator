import { AppConfig } from './app-config.type';
import { DatabaseConfig } from '../database-config/config/database-config.type';
import { AuthConfig } from '../auth-config/auth-config.type';

export type AllConfigType = {
  app: AppConfig;
  database: DatabaseConfig;
  auth: AuthConfig;
};
