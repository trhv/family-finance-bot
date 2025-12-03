import {
    Entity, PrimaryGeneratedColumn, Column,
    CreateDateColumn, OneToMany
  } from 'typeorm';
  import { Account } from './account.entity';
  import { Category } from './category.entity';
  import { Transaction } from './transaction.entity';
  import { AccountAlias } from './account-alias.entity';
  import { AccountBalance } from './account-balance.entity';
  import { SyncRun } from './sync-run.entity';
  
  @Entity('users')
  export class User {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column({ length: 32, unique: true })
    phoneNumber!: string;
  
    @Column({ length: 100 })
    displayName!: string;
  
    @Column({ length: 10, default: 'he-IL' })
    locale!: string;
  
    @CreateDateColumn({ type: 'datetime' })
    createdAt!: Date;
  
    @OneToMany(() => Account, acc => acc.user)
    accounts!: Account[];
  
    @OneToMany(() => Category, cat => cat.user)
    categories!: Category[];
  
    @OneToMany(() => Transaction, tx => tx.user)
    transactions!: Transaction[];
  
    @OneToMany(() => AccountAlias, alias => alias.user)
    aliases!: AccountAlias[];
  
    @OneToMany(() => AccountBalance, bal => bal.user)
    balances!: AccountBalance[];
  
    @OneToMany(() => SyncRun, sync => sync.user)
    syncRuns!: SyncRun[];
  }