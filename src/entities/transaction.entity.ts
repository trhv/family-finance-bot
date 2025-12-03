import {
    Entity, PrimaryGeneratedColumn, Column,
    ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn
  } from 'typeorm';
  import { User } from './user.entity';
  import { Account } from './account.entity';
  import { Category } from './category.entity';
  
  @Entity('transactions')
  export class Transaction {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => User, user => user.transactions)
    user: User;
  
    @ManyToOne(() => Account, acc => acc.transactions)
    account: Account;
  
    @Column({ nullable: true })
    externalId: string;
  
    @Column({ type: 'date' })
    bookingDate: Date;
  
    @Column({ type: 'date', nullable: true })
    valueDate: Date;
  
    @Column({ type: 'decimal', precision: 14, scale: 2 })
    amount: string;
  
    @Column({ length: 3, default: 'ILS' })
    currency: string;
  
    @Column({ type: 'text' })
    descriptionRaw: string;
  
    @Column({ type: 'text', nullable: true })
    descriptionClean: string;
  
    @ManyToOne(() => Category, cat => cat.transactions, { nullable: true })
    category: Category;
  
    @Column({ type: 'simple-json', nullable: true })
    tags: string[];
  
    @Column({ default: false })
    isPending: boolean;
  
    @Column({ default: false })
    isSplitChild: boolean;
  
    @ManyToOne(() => Transaction, tx => tx.children, { nullable: true })
    parentTransaction: Transaction;
  
    @OneToMany(() => Transaction, tx => tx.parentTransaction)
    children: Transaction[];
  
    @Column({ type: 'json', nullable: true })
    metadata: any;
  
    @CreateDateColumn({ type: 'datetime' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'datetime' })
    updatedAt: Date;
  }