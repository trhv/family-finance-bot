import { DataSource } from 'typeorm';
import { SyncRun } from '../entities/sync-run.entity';
import { SyncSourceType, SyncStatus } from '../entities/enums';

export class SyncService {
  constructor(private readonly dataSource: DataSource) {}

  private get repo() {
    return this.dataSource.getRepository(SyncRun);
  }

  /**
   * עוטף ריצת סנכרון עם לוג ב-DB
   */
  async runWithLog(params: {
    userId: number;
    institutionId?: number;
    sourceType: SyncSourceType;
    runner: () => Promise<{ transactionsImported: number }>;
  }): Promise<SyncRun> {
    const syncRun = this.repo.create({
      user: { id: params.userId } as any,
      institution: params.institutionId
        ? ({ id: params.institutionId } as any)
        : null,
      status: SyncStatus.PENDING,
      sourceType: params.sourceType,
    });

    const saved = await this.repo.save(syncRun);

    try {
      const result = await params.runner();

      saved.status = SyncStatus.SUCCESS;
      saved.finishedAt = new Date();
      saved.details = { transactionsImported: result.transactionsImported };

      return this.repo.save(saved);
    } catch (err: any) {
      saved.status = SyncStatus.FAILED;
      saved.finishedAt = new Date();
      saved.details = { error: err?.message ?? 'Unknown error' };
      return this.repo.save(saved);
    }
  }
}