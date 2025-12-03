import { DataSource } from 'typeorm';
import { AccountService } from './account.service';
import { AccountBalance } from '../entities/account-balance.entity';

export class MortgageService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly accountService: AccountService,
  ) {}

  /**
   * מחזיר רשימה של כל המשכנתאות והיתרה העדכנית בכל אחת
   */
  async getRemainingMortgages(userId: number): Promise<
    Array<{
      accountId: number;
      officialName: string | null;
      remaining: number;
      currency: string;
    }>
  > {
    const mortgages = await this.accountService.getMortgageAccounts(userId);
    const balRepo = this.dataSource.getRepository(AccountBalance);

    const results: Array<{
      accountId: number;
      officialName: string | null;
      remaining: number;
      currency: string;
    }> = [];

    for (const acc of mortgages) {
      const latest = await balRepo.findOne({
        where: { user: { id: userId }, account: { id: acc.id } },
        order: { asOfDate: 'DESC' },
      });

      if (!latest) continue;

      results.push({
        accountId: acc.id,
        officialName: acc.officialName ?? null,
        remaining: parseFloat(latest.balanceCurrent),
        currency: latest.currency,
      });
    }

    return results;
  }
}