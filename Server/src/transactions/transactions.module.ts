import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from './transaction.entity';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { UserEntity } from 'src/users/user.entity';
import { PurposeEntity } from 'src/purposes/purpose.entity';
import { JwtService } from '@nestjs/jwt';
import { PurposesService } from 'src/purposes/purposes.service';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity, UserEntity, PurposeEntity])],
  providers: [TransactionsService, JwtService, PurposesService, UsersService],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
