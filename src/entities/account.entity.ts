import {
    Entity, PrimaryGeneratedColumn, Column,
    ManyToOne, OneToMany, CreateDateColumn
  } from 'typeorm';
  import { User } from './user.entity';
  import { Institution } from './institution.entity';
  import { AccountType } from './enums';
  import { Transaction } from './transaction.entity';
  import { AccountAlias } from './account-alias.entity';
  import { AccountBalance } from './account-balance.entity';
  
  @Entity('accounts')
  export class Account {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => User, user => user.accounts)
    user: User;
  
    @ManyToOne(() => Institution, inst => inst.accounts, { nullable: true })
    institution: Institution;
  
    @Column({ nullable: true })
    officialName: string;
  
    @Column({ type: 'varchar', length: 30 })
    accountType: AccountType;
  
    @Column({ length: 3, default: 'ILS' })
    currency: string;
  
    @Column({ length: 32, nullable: true })
    accountNumberMask: string;
  
    @Column({ length: 4, nullable: true })
    last4: string;
  
    @Column({ default: true })
    isActive: boolean;
  
    @Column({ type: 'date', nullable: true })
    openedAt: Date;
  
    @Column({ type: 'date', nullable: true })
    closedAt: Date;
  
    @CreateDateColumn({ type: 'datetime' })
    createdAt: Date;
  
    @OneToMany(() => Transaction, tx => tx.account)
    transactions: Transaction[];
  
    @OneToMany(() => AccountAlias, alias => alias.account)
    aliases: AccountAlias[];
  
    @OneToMany(() => AccountBalance, bal => bal.account)
    balances: AccountBalance[];
  }