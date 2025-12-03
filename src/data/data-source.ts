// src/data/data-source.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { env } from '../config/env';
import { AccountBalance } from '../entities/account-balance.entity';
import { SyncRun } from '../entities/sync-run.entity';
import { Category } from '../entities/category.entity';
import { Transaction } from '../entities/transaction.entity';
import { AccountAlias } from '../entities/account-alias.entity';
import { Institution } from '../entities/institution.entity';
import { Account } from '../entities/account.entity';
import { User } from '../entities/user.entity';

// כרגע בלי entities כדי שיהיה קל להרים – נוסיף אותם אח"כ
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: env.db.host,
  port: env.db.port,
  username: env.db.user,
  password: env.db.pass,
  database: env.db.name,
  entities: [User,
    Institution,
    Account,
    AccountAlias,
    Category,
    Transaction,
    AccountBalance,
    SyncRun],           // בשלב הבא נוסיף את כל ה-entities
  synchronize: true,      // ב-MVP לוקאלי זה בסדר, אח"כ נחליף למיגרציות
  logging: env.nodeEnv !== 'production',
});