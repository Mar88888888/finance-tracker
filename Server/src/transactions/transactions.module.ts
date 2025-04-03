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

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity, UserEntity, PurposeEntity])],
  providers: [TransactionsService, JwtService, PurposesService, UsersService],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
