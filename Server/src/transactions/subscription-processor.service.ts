import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { RecurrenceUnit } from '../subscriptions/subscription.entity';
import { TransactionEntity } from './transaction.entity';
import { SubscriptionEntity } from '../subscriptions/subscription.entity';

@Injectable()
export class SubscriptionProcessorService {
  private readonly logger = new Logger(SubscriptionProcessorService.name);

  constructor(
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: Repository<SubscriptionEntity>,
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
  ) {}

  @Cron('01 00 * * *')
  async processRecurringTransactions() {
    const today = new Date();
    const subs = await this.subscriptionRepository.find({
      where: {
        isActive: true,
        nextExecutionDate: LessThanOrEqual<Date>(today),
      },
      relations: ['user', 'transactionTemplate', 'transactionTemplate.purpose'],
    });

    for (const sub of subs) {
      try {
        await this.createTransactionFromSubscription(sub);
        this.logger.log(`Processed subscription ${sub.id}`);
      } catch (e: any) {
        this.logger.error(`Failed to process subscription ${sub.id}: ${e.message}`);
      }
    }
  }

  async createTransactionFromSubscription(subscription: SubscriptionEntity) {
    const template = subscription.transactionTemplate;
    const today = new Date();

    const transaction = this.transactionRepository.create({
      ...template,
      id: undefined,
      date: new Date(subscription.nextExecutionDate),
      member: subscription.user,
    });

    await this.transactionRepository.save(transaction);

    const next = this.calculateNext(new Date(subscription.nextExecutionDate), subscription.interval, subscription.unit);
    subscription.nextExecutionDate = next;

    if (subscription.endDate && new Date(next) > new Date(subscription.endDate)) {
      subscription.isActive = false;
    }

    await this.subscriptionRepository.save(subscription);
  }

  calculateNext(date: Date, interval: number, unit: RecurrenceUnit): Date {
    this.logger.log(date, interval, unit);
    switch (unit) {
      case RecurrenceUnit.DAY:
        date.setDate(date.getDate() + interval);
        break;
      case RecurrenceUnit.WEEK:
        date.setDate(date.getDate() + interval * 7);
        break;
      case RecurrenceUnit.MONTH:
        date.setMonth(date.getMonth() + interval);
        break;
      case RecurrenceUnit.YEAR:
        date.setFullYear(date.getFullYear() + interval);
        break;
    }
    return date;
  }
}
