import { BadRequestException, NotFoundException } from '@nestjs/common';
import { SubscriptionsService } from '../../src/subscriptions/subscriptions.service';
import { subscriptionsRepoMock } from '../mocks/repos/subscriptions.repo.mock';
import { transactionsServiceMock } from '../mocks/services/transactions.service.mock';
import { usersServiceMock } from '../mocks/services/users.service.mock';
import { createSubscriptionDtoMock } from './subscription.dto.mock';
import { SubscriptionModel } from '../../src/subscriptions/subscription.model';
import { UserModel } from '../../src/users/user.model';
import { createUserModels } from '../fixtures/users.fixture';
import { TransactionModel } from '../../src/transactions/transaction.model';
import { createTransactionModels } from '../fixtures/transactions.fixtures';
import { createSubscriptionModels } from '../fixtures/subscriptions.fixtures';

describe('Subscriptions Service', () => {
  let sut: SubscriptionsService;
  let userModels: UserModel[];
  let transactionModels: TransactionModel[];
  let subscriptionModels: SubscriptionModel[];

  beforeEach(() => {
    sut = new SubscriptionsService(
      subscriptionsRepoMock as any,
      transactionsServiceMock as any,
      usersServiceMock as any,
    );

    userModels = createUserModels();
    transactionModels = createTransactionModels();
    subscriptionModels = createSubscriptionModels();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should throw BadRequest exception if subscription for given transaction already exists', () => {
    jest
      .spyOn(sut, 'findOneByTransactionId')
      .mockResolvedValueOnce(subscriptionModels[0]);
    sut
      .createSubscription(
        userModels[0].getId(),
        transactionModels[0].getId(),
        createSubscriptionDtoMock,
      )
      .catch((err) => {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message).toBe('This transaction is already subscribed to.');
      });
  });

  it('should create a subscription', async () => {
    jest.spyOn(sut, 'findOneByTransactionId').mockResolvedValueOnce(undefined);
    const result = await sut.createSubscription(
      userModels[0].getId(),
      transactionModels[0].getId(),
      createSubscriptionDtoMock,
    );

    expect(result).toBeInstanceOf(SubscriptionModel);
    expect(result).toEqual(subscriptionModels[0]);
  });

  it('should return subscription for current user', async () => {
    const result = await sut.getUserSubscriptions(userModels[0].getId());

    const expected = subscriptionModels;

    expect(result).toEqual(expected);
  });

  it('should return subscription by transactionId', async () => {
    const transactionId = transactionModels[0].getId();
    const result = await sut.findOneByTransactionId(transactionId);

    const expected = subscriptionModels[0];
    expect(result).toEqual(expected);
  });

  it('should throw NotFoundException if no subscription with provided id found', () => {
    jest
      .spyOn(subscriptionsRepoMock, 'findOne')
      .mockResolvedValueOnce(undefined);
    const subscriptionId = subscriptionModels[0].getId();
    sut.findOne(subscriptionId).catch((err) => {
      expect(err).toBeInstanceOf(NotFoundException);
      expect(err.message).toBe('Subscription not found');
    });
  });

  it('should return subscription by provided id', async () => {
    const subscriptionId = subscriptionModels[0].getId();
    const result = await sut.findOne(subscriptionId);

    const expected = subscriptionModels[0];

    expect(result).toEqual(expected);
  });

  it('should delete subscription by id', () => {
    const subscriptionId = subscriptionModels[0].getId();
    sut.deleteSubscription(subscriptionId);

    expect(subscriptionsRepoMock.delete).toHaveBeenCalledWith(subscriptionId);
  });
});
