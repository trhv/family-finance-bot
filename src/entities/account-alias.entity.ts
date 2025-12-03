import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Account } from './account.entity';

@Entity('account_aliases')
export class AccountAlias {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.aliases)
  user: User;

  @ManyToOne(() => Account, acc => acc.aliases)
  account: Account;

  @Column({ length: 100 })
  alias: string;

  @Column({ default: true })
  isPrimary: boolean;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @Column({ type: 'datetime', nullable: true })
  validUntil: Date;
}