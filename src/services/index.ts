import { AppDataSource } from '../data/data-source';
import { AccountService } from './account.service';
import { AliasService } from './alias.service';
import { CategoryService } from './category.service';
import { TransactionService } from './transaction.service';
import { AnalyticsService } from './analytics.service';
import { MortgageService } from './mortgage.service';
import { SyncService } from './sync.service';

const accountService = new AccountService(AppDataSource);
const aliasService = new AliasService(AppDataSource);
const categoryService = new CategoryService(AppDataSource);
const transactionService = new TransactionService(AppDataSource);
const analyticsService = new AnalyticsService(AppDataSource);
const syncService = new SyncService(AppDataSource);
const mortgageService = new MortgageService(AppDataSource, accountService);

export const services = {
  accountService,
  aliasService,
  categoryService,
  transactionService,
  analyticsService,
  syncService,
  mortgageService,
};