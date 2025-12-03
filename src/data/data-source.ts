// src/data/data-source.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { env } from '../config/env';

// כרגע בלי entities כדי שיהיה קל להרים – נוסיף אותם אח"כ
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: env.db.host,
  port: env.db.port,
  username: env.db.user,
  password: env.db.pass,
  database: env.db.name,
  entities: [],           // בשלב הבא נוסיף את כל ה-entities
  synchronize: true,      // ב-MVP לוקאלי זה בסדר, אח"כ נחליף למיגרציות
  logging: env.nodeEnv !== 'production',
});