export enum AccountType {
    CHECKING = 'CHECKING',
    CREDIT_CARD = 'CREDIT_CARD',
    MORTGAGE = 'MORTGAGE',
    SAVINGS = 'SAVINGS',
  }
  
  export enum InstitutionType {
    BANK = 'BANK',
    CREDIT_CARD_COMPANY = 'CREDIT_CARD_COMPANY',
    MORTGAGE_BANK = 'MORTGAGE_BANK',
  }
  
  export enum CategoryDirection {
    EXPENSE = 'EXPENSE',
    INCOME = 'INCOME',
    TRANSFER = 'TRANSFER',
  }
  
  export enum SyncStatus {
    PENDING = 'PENDING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
  }
  
  export enum SyncSourceType {
    BANK_SCRAPER = 'BANK_SCRAPER',
    CREDIT_CARD_SCRAPER = 'CREDIT_CARD_SCRAPER',
    FILE_IMPORT = 'FILE_IMPORT',
  }