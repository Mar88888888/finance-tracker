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

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "password",
    database: "finance",
    entities: [User, Purpose, Transaction],
    synchronize: true,
    logging: true,
  }), UsersModule, TransactionsModule, PurposesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
