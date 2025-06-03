import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from './transaction.entity';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { UserEntity } from '../users/user.entity';
import { PurposeEntity } from '../purposes/purpose.entity';
import { JwtService } from '@nestjs/jwt';
import { PurposesService } from '../purposes/purposes.service';
import { UsersService } from '../users/users.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { SubscriptionEntity } from '../subscriptions/subscription.entity';
import { SubscriptionProcessorService } from './subscription-processor.service';
import { CurrencyService } from '../currency/currency.service';
import { CurrencyEntity } from '../currency/currency.entity';
import { CurrencyModule } from '../currency/currency.module';

@Module({
  imports: [TypeOrmModule.forFeature(
    [TransactionEntity, UserEntity, PurposeEntity, SubscriptionEntity, CurrencyEntity]
  ), CurrencyModule],
  providers: [TransactionsService, JwtService,
    PurposesService, UsersService,
    SubscriptionProcessorService, SubscriptionsService, CurrencyService],
  controllers: [TransactionsController],
  exports: [TransactionsService],
})
export class TransactionsModule {}
