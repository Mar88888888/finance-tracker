import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionEntity } from './subscription.entity';
import { UsersService } from '../users/users.service';
import { TransactionsService } from '../transactions/transactions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { TransactionModel } from '../transactions/transaction.model';
import { UserModel } from '../users/user.model';
import { SubscriptionModel } from './subscription.model';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: Repository<SubscriptionEntity>,
    private readonly transactionService: TransactionsService,
    private readonly usersService: UsersService,
  ) {}

  async createsubscription(userId: number,dto: CreateSubscriptionDto) {
    const user = UserModel.toEntity(await this.usersService.findOne(userId));
    const transaction = TransactionModel.toEntity(await this.transactionService.findOne(dto.transactionId));
    
    const subscription = this.subscriptionRepository.create({
      interval: dto.interval,
      unit: dto.unit,
      startDate: dto.startDate,
      nextExecutionDate: dto.startDate,
      endDate: dto.endDate,
      transactionTemplate: transaction,
      user,
    });
  
    return SubscriptionModel.fromEntity(await this.subscriptionRepository.save(subscription));
  }
  
}
