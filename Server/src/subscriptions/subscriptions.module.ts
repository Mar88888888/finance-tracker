import { Module } from '@nestjs/common';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionEntity } from './subscription.entity';
import { TransactionsModule } from '../transactions/transactions.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionEntity]), TransactionsModule, UsersModule],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
