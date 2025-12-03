// src/services/qa-facade.service.ts
import { AnalyticsService } from './analytics.service';
import { AccountService } from './account.service';
import { AliasService } from './alias.service';
import { MortgageService } from './mortgage.service';
import { getLastMonthRange } from '../utils/date-utils';

export class QAFacadeService {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly accountService: AccountService,
    private readonly aliasService: AliasService,
    private readonly mortgageService: MortgageService,
  ) {}

  /**
   * "כמה הוצאתי על <קטגוריה> בחודש הקודם?"
   */
  async getSpentOnCategoryLastMonth(params: {
    userId: number;
    categoryName: string;
    now?: Date;
  }): Promise<{
    total: number;
    from: Date;
    to: Date;
    year: number;
    month: number;
  }> {
    const { from, to, year, month } = getLastMonthRange(params.now ?? new Date());

    const total = await this.analyticsService.getSpentOnCategory({
      userId: params.userId,
      categoryName: params.categoryName,
      fromDate: from,
      toDate: to,
    });

    return { total, from, to, year, month };
  }

  /**
   * "מה המצב כרגע בחשבון <alias>?"
   */
  async getCurrentBalanceForAlias(params: {
    userId: number;
    alias: string;
  }): Promise<{
    balanceCurrent: number;
    balanceAvailable: number | null;
    currency: string;
  } | null> {
    const accountId = await this.aliasService.findAccountIdByAlias(
      params.userId,
      params.alias,
    );

    if (!accountId) {
      return null;
    }

    const latest = await this.accountService.getLatestBalanceForAccount(
      params.userId,
      accountId,
    );

    if (!latest) {
      return null;
    }

    return {
      balanceCurrent: parseFloat(latest.balanceCurrent),
      balanceAvailable: latest.balanceAvailable
        ? parseFloat(latest.balanceAvailable)
        : null,
      currency: latest.currency,
    };
  }

  /**
   * "כמה משכנתא נשארה לי?"
   */
  async getMortgageRemaining(params: { userId: number }) {
    const list = await this.mortgageService.getRemainingMortgages(params.userId);
    return list; // רשימה של חשבונות משכנתא עם יתרה
  }
}