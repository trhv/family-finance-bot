import {
    Entity, PrimaryGeneratedColumn, Column,
    ManyToOne, CreateDateColumn
  } from 'typeorm';
  import { User } from './user.entity';
  import { Institution } from './institution.entity';
  import { SyncStatus, SyncSourceType } from './enums';
  
  @Entity('sync_runs')
  export class SyncRun {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => User, user => user.syncRuns)
    user: User;
  
    @ManyToOne(() => Institution, inst => inst.syncRuns, { nullable: true })
    institution: Institution;
  
    @CreateDateColumn({ type: 'datetime' })
    startedAt: Date;
  
    @Column({ type: 'datetime', nullable: true })
    finishedAt: Date;
  
    @Column({ type: 'varchar', length: 20 })
    status: SyncStatus;
  
    @Column({ type: 'varchar', length: 30 })
    sourceType: SyncSourceType;
  
    @Column({ type: 'json', nullable: true })
    details: any;
  
    @CreateDateColumn({ type: 'datetime' })
    createdAt: Date;
  }