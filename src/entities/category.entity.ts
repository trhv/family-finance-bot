import {
    Entity, PrimaryGeneratedColumn, Column,
    ManyToOne, OneToMany, CreateDateColumn
  } from 'typeorm';
  import { User } from './user.entity';
  import { CategoryDirection } from './enums';
  import { Transaction } from './transaction.entity';
  
  @Entity('categories')
  export class Category {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => User, user => user.categories, { nullable: true })
    user: User;
  
    @Column({ length: 100 })
    name: string;
  
    @ManyToOne(() => Category, cat => cat.children, { nullable: true })
    parent: Category;
  
    @OneToMany(() => Category, cat => cat.parent)
    children: Category[];
  
    @Column({ type: 'varchar', length: 20 })
    direction: CategoryDirection;
  
    @Column({ default: false })
    isSystem: boolean;
  
    @CreateDateColumn({ type: 'datetime' })
    createdAt: Date;
  
    @OneToMany(() => Transaction, tx => tx.category)
    transactions: Transaction[];
  }