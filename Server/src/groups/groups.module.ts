import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupEntity } from './group.entity';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { TransactionsService } from '../transactions/transactions.service';
import { TransactionEntity } from '../transactions/transaction.entity';
import { PurposesService } from '../purposes/purposes.service';
import { PurposeEntity } from '../purposes/purpose.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GroupEntity, TransactionEntity, PurposeEntity]),
  JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '1h' }
  }), UsersModule
  ],
  providers: [GroupsService, TransactionsService, PurposesService],
  controllers: [GroupsController]
})
export class GroupsModule { }
