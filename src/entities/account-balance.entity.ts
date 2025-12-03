import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Account } from './account.entity';

@Entity('account_balances')
export class AccountBalance {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.balances)
  user: User;

  @ManyToOne(() => Account, acc => acc.balances)
  account: Account;

  @Column({ type: 'date' })
  asOfDate: Date;

  @Column({ type: 'decimal', precision: 14, scale: 2 })
  balanceCurrent: string;

  @Column({ type: 'decimal', precision: 14, scale: 2, nullable: true })
  balanceAvailable: string;

  @Column({ length: 3, default: 'ILS' })
  currency: string;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;
}