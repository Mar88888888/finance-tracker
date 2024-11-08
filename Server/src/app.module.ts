import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TransactionsModule } from './transactions/transactions.module';
import { PurposesModule } from './purposes/purposes.module';
import { User } from './users/user.entity';
import { Purpose } from './purposes/purpose.entity';
import { Transaction } from './transactions/transaction.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { GroupsModule } from './groups/groups.module';
import { Group } from './groups/group.entity';

@Module({
  imports: [    
    TypeOrmModule.forRoot({
    type: 'postgres',
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "password",
    database: "finance",
    entities: [User, Purpose, Transaction, Group],
    synchronize: true,
    logging: true,
  }),
  UsersModule, TransactionsModule, PurposesModule, GroupsModule],
  controllers: [AppController],
  providers: [AppService,  JwtService],
})
export class AppModule {}
