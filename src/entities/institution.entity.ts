import {
    Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn
  } from 'typeorm';
  import { InstitutionType } from './enums';
  import { Account } from './account.entity';
  import { SyncRun } from './sync-run.entity';
  
  @Entity('institutions')
  export class Institution {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column({ length: 100 })
    name!: string;
  
    @Column({ length: 2 })
    country!: string;
  
    @Column({ type: 'varchar', length: 50 })
    type!: InstitutionType;
  
    @Column({ type: 'json', nullable: true })
    metadata!: any;
  
    @CreateDateColumn({ type: 'datetime' })
    createdAt!: Date;
  
    @OneToMany(() => Account, acc => acc.institution)
    accounts!: Account[];
  
    @OneToMany(() => SyncRun, sync => sync.institution)
    syncRuns!: SyncRun[];
  }