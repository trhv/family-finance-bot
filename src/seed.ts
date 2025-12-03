import { AppDataSource } from './data/data-source';
import { User } from './entities/user.entity';
import { Institution } from './entities/institution.entity';
import { Account } from './entities/account.entity';
import { AccountAlias } from './entities/account-alias.entity';
import { Category } from './entities/category.entity';
import { Transaction } from './entities/transaction.entity';
import { AccountBalance } from './entities/account-balance.entity';

import {
  AccountType,
  CategoryDirection,
  InstitutionType,
} from './entities/enums';

async function runSeed() {
  console.log('Initializing DB...');
  await AppDataSource.initialize();
  console.log('DB connected');

  const userRepo = AppDataSource.getRepository(User);
  const instRepo = AppDataSource.getRepository(Institution);
  const accountRepo = AppDataSource.getRepository(Account);
  const aliasRepo = AppDataSource.getRepository(AccountAlias);
  const categoryRepo = AppDataSource.getRepository(Category);
  const txRepo = AppDataSource.getRepository(Transaction);
  const balanceRepo = AppDataSource.getRepository(AccountBalance);

  console.log('Seeding user...');
  const user = userRepo.create({
    phoneNumber: '+972501234567',
    displayName: 'אריה – מנהל כספים משפחתי',
    locale: 'he-IL',
  });
  await userRepo.save(user);

  console.log('Seeding institution...');
  const inst = instRepo.create({
    name: 'Bank Hapoalim',
    country: 'IL',
    type: InstitutionType.BANK,
  } as Partial<Institution>);
  await instRepo.save(inst);

  console.log('Seeding accounts...');
  const checking = accountRepo.create({
    user,
    institution: inst,
    accountType: AccountType.CHECKING,
    officialName: 'עו״ש ראשי',
    currency: 'ILS',
    last4: '1111',
    isActive: true,
  });

  const creditCard = accountRepo.create({
    user,
    institution: inst,
    accountType: AccountType.CREDIT_CARD,
    officialName: 'כרטיס MAX',
    currency: 'ILS',
    last4: '1234',
    isActive: true,
  });

  const mortgage = accountRepo.create({
    user,
    institution: inst,
    accountType: AccountType.MORTGAGE,
    officialName: 'משכנתא ראשית',
    currency: 'ILS',
    last4: '9999',
    isActive: true,
  });

  await accountRepo.save(checking);
  await accountRepo.save(creditCard);
  await accountRepo.save(mortgage);

  console.log('Setting alias for credit card...');
  const alias = aliasRepo.create({
    user,
    account: creditCard,
    alias: 'אריה',
    isPrimary: true,
  });
  await aliasRepo.save(alias);

  console.log('Seeding categories...');
  const clothing = categoryRepo.create({
    name: 'ביגוד',
    direction: CategoryDirection.EXPENSE,
    isSystem: false,
  });

  const groceries = categoryRepo.create({
    name: 'סופר',
    direction: CategoryDirection.EXPENSE,
    isSystem: false,
  });

  const salary = categoryRepo.create({
    name: 'משכורת',
    direction: CategoryDirection.INCOME,
    isSystem: false,
  });

  await categoryRepo.save(clothing);
  await categoryRepo.save(groceries);
  await categoryRepo.save(salary);

  console.log('Seeding transactions...');
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 15);

  const tx1 = txRepo.create({
    user,
    account: creditCard,
    bookingDate: lastMonth,
    amount: '-250.00',
    currency: 'ILS',
    descriptionRaw: 'ZARA - חולצה',
    category: clothing,
  });

  const tx2 = txRepo.create({
    user,
    account: creditCard,
    bookingDate: lastMonth,
    amount: '-520.00',
    currency: 'ILS',
    descriptionRaw: 'Shufersal',
    category: groceries,
  });

  const tx3 = txRepo.create({
    user,
    account: checking,
    bookingDate: new Date(now.getFullYear(), now.getMonth(), 1),
    amount: '10000.00',
    currency: 'ILS',
    descriptionRaw: 'Salary deposit',
    category: salary,
  });

  await txRepo.save(tx1);
  await txRepo.save(tx2);
  await txRepo.save(tx3);

  console.log('Seeding balance...');
  const balance1 = balanceRepo.create({
    user,
    account: checking,
    asOfDate: new Date(),
    balanceCurrent: '3500.00',
    balanceAvailable: '3000.00',
    currency: 'ILS',
  });

  const balance2 = balanceRepo.create({
    user,
    account: mortgage,
    asOfDate: new Date(),
    balanceCurrent: '870000.00', // יתרת משכנתא
    balanceAvailable: null,
    currency: 'ILS',
  } as Partial<AccountBalance>);

  await balanceRepo.save(balance1);
  await balanceRepo.save(balance2);

  console.log('Seed completed successfully! 🌱');
  process.exit(0);
}

runSeed().catch((err) => {
  console.error(err);
  process.exit(1);
});