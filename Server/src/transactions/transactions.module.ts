import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { User } from 'src/users/user.entity';
import { Purpose } from 'src/purposes/purpose.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { PurposesService } from 'src/purposes/purposes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, User, Purpose]), UsersModule],
  providers: [TransactionsService, JwtService, PurposesService],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
