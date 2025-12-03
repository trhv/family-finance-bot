import { DataSource } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';

export class AnalyticsService {
  constructor(private readonly dataSource: DataSource) {}

  /**
   * כמה הוצאתי על קטגוריה בטווח תאריכים
   * מחזיר סכום חיובי (מוחלט)
   */
  async getSpentOnCategory(params: {
    userId: number;
    categoryName: string;
    fromDate: Date;
    toDate: Date;
  }): Promise<number> {
    const qb = this.dataSource
      .getRepository(Transaction)
      .createQueryBuilder('t')
      .leftJoin('t.category', 'c')
      .where('t.userId = :userId', { userId: params.userId })
      .andWhere('c.name = :categoryName', {
        categoryName: params.categoryName,
      })
      .andWhere('t.bookingDate >= :fromDate', { fromDate: params.fromDate })
      .andWhere('t.bookingDate < :toDate', { toDate: params.toDate });

    const result = await qb
      .select('SUM(t.amount)', 'sum')
      .getRawOne<{ sum: string | null }>();

    if (!result || !result.sum) return 0;
    return Math.abs(parseFloat(result.sum));
  }

  /**
   * סה״כ הוצאות בטווח תאריכים
   */
  async getTotalExpenses(params: {
    userId: number;
    fromDate: Date;
    toDate: Date;
  }): Promise<number> {
    const qb = this.dataSource
      .getRepository(Transaction)
      .createQueryBuilder('t')
      .where('t.userId = :userId', { userId: params.userId })
      .andWhere('t.bookingDate >= :fromDate', { fromDate: params.fromDate })
      .andWhere('t.bookingDate < :toDate', { toDate: params.toDate })
      .andWhere('t.amount < 0');

    const result = await qb
      .select('SUM(t.amount)', 'sum')
      .getRawOne<{ sum: string | null }>();

    if (!result || !result.sum) return 0;
    return Math.abs(parseFloat(result.sum));
  }

  /**
   * סיכום חודשי לפי קטגוריה (הכנסה/הוצאה)
   */
  async getMonthlySummaryByCategory(params: {
    userId: number;
    year: number;
    month: number; // 1-12
  }): Promise<
    Array<{
      categoryName: string;
      totalExpense: number;
      totalIncome: number;
    }>
  > {
    const from = new Date(params.year, params.month - 1, 1);
    const to = new Date(params.year, params.month, 1);

    const qb = this.dataSource
      .getRepository(Transaction)
      .createQueryBuilder('t')
      .leftJoin('t.category', 'c')
      .where('t.userId = :userId', { userId: params.userId })
      .andWhere('t.bookingDate >= :fromDate', { fromDate: from })
      .andWhere('t.bookingDate < :toDate', { toDate: to });

    const rows = await qb
      .select([
        "COALESCE(c.name, 'Uncategorized') as categoryName",
        "SUM(CASE WHEN t.amount < 0 THEN t.amount ELSE 0 END) as totalExpense",
        "SUM(CASE WHEN t.amount > 0 THEN t.amount ELSE 0 END) as totalIncome",
      ])
      .groupBy('categoryName')
      .getRawMany<{
        categoryName: string;
        totalExpense: string;
        totalIncome: string;
      }>();

    return rows.map((r) => ({
      categoryName: r.categoryName,
      totalExpense: Math.abs(parseFloat(r.totalExpense ?? '0')),
      totalIncome: parseFloat(r.totalIncome ?? '0'),
    }));
  }
}