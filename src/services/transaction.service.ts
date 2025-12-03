import { DataSource } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { Category } from '../entities/category.entity';

export class TransactionService {
  constructor(private readonly dataSource: DataSource) {}

  private get repo() {
    return this.dataSource.getRepository(Transaction);
  }

  /**
   * עדכון קטגוריה לעסקה (למשל אחרי "העסקה הזו היא על ביגוד")
   */
  async setTransactionCategory(params: {
    userId: number;
    transactionId: number;
    categoryId: number;
  }): Promise<Transaction> {
    const tx = await this.repo.findOne({
      where: { id: params.transactionId, user: { id: params.userId } },
    });

    if (!tx) {
      throw new Error('Transaction not found or does not belong to user');
    }

    const category = await this.dataSource
      .getRepository(Category)
      .findOneByOrFail({ id: params.categoryId });

    tx.category = category;
    return this.repo.save(tx);
  }

  /**
   * ייבוא/עדכון טרנזקציות מהבנק עבור חשבון מסוים (bulk upsert)
   */
  async upsertTransactionsFromInstitution(params: {
    userId: number;
    accountId: number;
    rows: Array<{
      externalId?: string;
      bookingDate: Date;
      valueDate?: Date;
      amount: string;
      currency?: string;
      descriptionRaw: string;
      metadata?: Record<string, any>;
    }>;
  }): Promise<number> {
    let count = 0;

    for (const row of params.rows) {
      let entity: Transaction | null = null;

      if (row.externalId) {
        entity = await this.repo.findOne({
          where: {
            user: { id: params.userId },
            externalId: row.externalId,
          },
        });
      }

      if (!entity) {
        entity = this.repo.create({
          user: { id: params.userId } as any,
          account: { id: params.accountId } as any,
          externalId: row.externalId ?? null,
          bookingDate: row.bookingDate,
          valueDate: row.valueDate ?? null,
          amount: row.amount,
          currency: row.currency ?? 'ILS',
          descriptionRaw: row.descriptionRaw,
          metadata: row.metadata ?? null,
        } as Partial<Transaction>);
      } else {
        entity.bookingDate = row.bookingDate;
        entity.valueDate = row.valueDate ?? null;
        entity.amount = row.amount;
        entity.currency = row.currency ?? entity.currency;
        entity.descriptionRaw = row.descriptionRaw;
        entity.metadata = row.metadata ?? entity.metadata;
      }

      await this.repo.save(entity);
      count++;
    }

    return count;
  }
}