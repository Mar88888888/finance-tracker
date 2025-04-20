import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TransactionsModule } from './transactions/transactions.module';
import { PurposesModule } from './purposes/purposes.module';
import { UserEntity } from './users/user.entity';
import { PurposeEntity } from './purposes/purpose.entity';
import { TransactionEntity } from './transactions/transaction.entity';
import { JwtService } from '@nestjs/jwt';
import { GroupsModule } from './groups/groups.module';
import { GroupEntity } from './groups/group.entity';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { SubscriptionEntity } from './subscriptions/subscription.entity';
import { ScheduleModule } from '@nestjs/schedule';
require('dotenv').config();

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: "localhost",
      port: 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [UserEntity, PurposeEntity, TransactionEntity, GroupEntity, SubscriptionEntity],
      synchronize: true,
    }),
    UsersModule, TransactionsModule, PurposesModule, GroupsModule, SubscriptionsModule],
  controllers: [AppController],
  providers: [AppService, JwtService],
})
export class AppModule { }
