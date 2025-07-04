import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

  async createSubscription(userId: number, transactionId: number, dto: CreateSubscriptionDto) {
    const user = UserModel.toEntity(await this.usersService.findOne(userId));
    const transaction = TransactionModel.toEntity(await this.transactionService.findOne(transactionId));
    
    const existing = await this.findOneByTransactionId(transactionId);    
    if (existing) {
      throw new BadRequestException('This transaction is already subscribed to.');
    }
    

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

  async getUserSubscriptions(userId: number): Promise<SubscriptionModel[]> {
    const subscriptions = await this.subscriptionRepository.find({
      where: { user: { id: userId } },
      relations: ['transactionTemplate', 'user'],
    });
    return subscriptions.map(SubscriptionModel.fromEntity);
  }
  

  async findOneByTransactionId(transactionId: number): Promise<SubscriptionModel> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { transactionTemplate: { id: transactionId } },
      relations: ['transactionTemplate', 'user'],
    });
    if (subscription) {
      return SubscriptionModel.fromEntity(subscription);
    }
  }

  async findOne(id: number): Promise<SubscriptionModel> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
      relations: ['transactionTemplate', 'user'],
    });
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }
    return SubscriptionModel.fromEntity(subscription);
  }

  async deleteSubscription(subscriptionId: number): Promise<void> {
    await this.subscriptionRepository.delete(subscriptionId);
  }
}
