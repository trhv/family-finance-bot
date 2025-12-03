import { DataSource } from 'typeorm';
import { AccountAlias } from '../entities/account-alias.entity';
import { Account } from '../entities/account.entity';

export class AliasService {
  constructor(private readonly dataSource: DataSource) {}

  private get aliasRepo() {
    return this.dataSource.getRepository(AccountAlias);
  }

  private get accountRepo() {
    return this.dataSource.getRepository(Account);
  }

  /**
   * "מעכשיו כרטיס שמסתיים ב-1234 נקרא אריה"
   */
  async setAliasForCardLast4(params: {
    userId: number;
    last4: string;
    alias: string;
  }): Promise<AccountAlias> {
    const account = await this.accountRepo.findOne({
      where: {
        user: { id: params.userId },
        last4: params.last4,
      },
    });

    if (!account) {
      throw new Error(
        `Account with last4=${params.last4} not found for user ${params.userId}`,
      );
    }

    // מנטרלים alias קודם עם אותו שם (אם יש)
    await this.aliasRepo.update(
      { user: { id: params.userId }, alias: params.alias, isPrimary: true },
      { isPrimary: false, validUntil: new Date() },
    );

    const entity = this.aliasRepo.create({
      user: { id: params.userId } as any,
      account,
      alias: params.alias,
      isPrimary: true,
    });

    return this.aliasRepo.save(entity);
  }

  /**
   * מציאת accountId לפי alias
   */
  async findAccountIdByAlias(
    userId: number,
    alias: string,
  ): Promise<number | null> {
    const found = await this.aliasRepo.findOne({
      where: {
        user: { id: userId },
        alias,
        isPrimary: true,
      },
      relations: ['account'],
    });

    return found?.account?.id ?? null;
  }
}