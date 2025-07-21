/*istanbul ignore file */
import { DataSource } from 'typeorm';
import { TransactionEntity } from './transactions/transaction.entity';
import { CurrencyEntity } from './currency/currency.entity';
import { UserEntity } from './users/user.entity';
import { PurposeEntity } from './purposes/purpose.entity';
import { GroupEntity } from './groups/group.entity';
import { SubscriptionEntity } from './subscriptions/subscription.entity';
import 'dotenv/config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: true,
  entities: [
    TransactionEntity,
    CurrencyEntity,
    UserEntity,
    PurposeEntity,
    GroupEntity,
    SubscriptionEntity,
  ],
  migrations: ['src/migrations/*.ts'],
});
