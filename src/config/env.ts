// src/config/env.ts
import * as dotenv from 'dotenv';

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'family_finance',
    pass: process.env.DB_PASS || 'family_finance_password',
    name: process.env.DB_NAME || 'family_finance',
  },
  app: {
    port: Number(process.env.APP_PORT || 3000),
  },
};