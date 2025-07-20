import {
  RecurrenceUnit,
  SubscriptionEntity,
} from '../../src/subscriptions/subscription.entity';
import { SubscriptionModel } from '../../src/subscriptions/subscription.model';
import { SubscriptionProcessorService } from '../../src/transactions/subscription-processor.service';
import { TransactionEntity } from '../../src/transactions/transaction.entity';
import {
  createSubscriptionEntities,
  createSubscriptionModels,
} from '../fixtures/subscriptions.fixtures';
import {
  createTransactionEntities,
  createTransactionModels,
} from '../fixtures/transactions.fixtures';
import { RepoMock } from '../mocks/repos/repo.mock.interface';
import { subscriptionsRepoMock } from '../mocks/repos/subscriptions.repo.mock';
import { createTransactionRepoMock } from '../mocks/repos/transactions.repo.mock';

describe('Subscription Processor Service', () => {
  let sut: SubscriptionProcessorService;
  let subscriptionModels: SubscriptionModel[];
  let subscriptionEntities: SubscriptionEntity[];
  let transactionsRepoMock: RepoMock<TransactionEntity>;

  beforeEach(() => {
    const transactionModels = createTransactionModels();
    const transactionEntities = createTransactionEntities(transactionModels);
    transactionsRepoMock = createTransactionRepoMock(transactionEntities);

    subscriptionModels = createSubscriptionModels();
    subscriptionEntities = createSubscriptionEntities(subscriptionModels);
    sut = new SubscriptionProcessorService(
      subscriptionsRepoMock as any,
      transactionsRepoMock as any,
    );
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should calculate next transction date for day', () => {
    const day = sut.calculateNext(
      new Date('01-01-2001'),
      1,
      RecurrenceUnit.DAY,
    );
    expect(day).toEqual(new Date('01-02-2001'));
  });

  it('should calculate next transction date for week', () => {
    const week = sut.calculateNext(
      new Date('01-01-2001'),
      1,
      RecurrenceUnit.WEEK,
    );

    expect(week).toEqual(new Date('01-08-2001'));
  });

  it('should calculate next transction date for month', () => {
    const month = sut.calculateNext(
      new Date('01-01-2001'),
      1,
      RecurrenceUnit.MONTH,
    );

    expect(month).toEqual(new Date('02-01-2001'));
  });

  it('should calculate next transction date for year', () => {
    const year = sut.calculateNext(
      new Date('01-01-2001'),
      1,
      RecurrenceUnit.YEAR,
    );

    expect(year).toEqual(new Date('01-01-2002'));
  });

  it('should create a transaction from subscription', async () => {
    await sut.createTransactionFromSubscription(subscriptionEntities[0]);
    expect(transactionsRepoMock.create).toHaveBeenCalledTimes(1);
    expect(transactionsRepoMock.save).toHaveBeenCalledTimes(1);
    expect(subscriptionsRepoMock.save).toHaveBeenCalledTimes(1);
  });

  it('should process reccurring transactions', async () => {
    jest.spyOn(sut, 'createTransactionFromSubscription').mockResolvedValue();

    await sut.processRecurringTransactions();

    expect(sut.createTransactionFromSubscription).toHaveBeenCalledTimes(
      subscriptionEntities.length,
    );
    expect(
      (sut.createTransactionFromSubscription as jest.Mock).mock.calls,
    ).toEqual(subscriptionEntities.map((sub) => [sub]));
  });
});
