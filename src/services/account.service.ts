import { DataSource } from 'typeorm';
import { Account } from '../entities/account.entity';
import { AccountBalance } from '../entities/account-balance.entity';
import { User } from '../entities/user.entity';
import { Institution } from '../entities/institution.entity';
import { AccountType } from '../entities/enums';

export class AccountService {
  constructor(private readonly dataSource: DataSource) {}

  private get accountRepo() {
    return this.dataSource.getRepository(Account);
  }

  private get balanceRepo() {
    return this.dataSource.getRepository(AccountBalance);
  }

  /**
   * יצירת חשבון חדש (עו״ש / אשראי / משכנתא וכו׳)
   */
  async createAccount(params: {
    userId: number;
    institutionId?: number;
    officialName?: string;
    accountType: AccountType;
    currency?: string;
    last4?: string;
    accountNumberMask?: string;
  }): Promise<Account> {
    const user = await this.dataSource
      .getRepository(User)
      .findOneByOrFail({ id: params.userId });

    const institution = params.institutionId
      ? await this.dataSource
          .getRepository(Institution)
          .findOneBy({ id: params.institutionId })
      : null;

    const account = this.accountRepo.create({
      user,
      institution: institution || null,
      officialName: params.officialName ?? null,
      accountType: params.accountType,
      currency: params.currency ?? 'ILS',
      last4: params.last4 ?? null,
      accountNumberMask: params.accountNumberMask ?? null,
      isActive: true,
    } as Partial<Account>);

    return this.accountRepo.save(account);
  }

  /**
   * מציאת חשבון לפי user + 4 ספרות אחרונות
   */
  async findByLast4(userId: number, last4: string): Promise<Account | null> {
    return this.accountRepo.findOne({
      where: {
        user: { id: userId },
        last4,
      },
    });
  }

  /**
   * היתרה האחרונה לחשבון
   */
  async getLatestBalanceForAccount(
    userId: number,
    accountId: number,
  ): Promise<AccountBalance | null> {
    return this.balanceRepo.findOne({
      where: {
        user: { id: userId },
        account: { id: accountId },
      },
      order: { asOfDate: 'DESC' },
    });
  }

  /**
   * כל חשבונות המשכנתא של המשתמש
   */
  async getMortgageAccounts(userId: number): Promise<Account[]> {
    return this.accountRepo.find({
      where: {
        user: { id: userId },
        accountType: AccountType.MORTGAGE,
      },
    });
  }
}