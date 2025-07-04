import { BadRequestException, NotFoundException } from "@nestjs/common";
import { SubscriptionsService } from "../../src/subscriptions/subscriptions.service";
import { testSubscriptions } from "../fixtures/subscriptions.fixtures";
import { testTransactions } from "../fixtures/transactions.fixtures";
import { members } from "../fixtures/users.fixture";
import { subscriptionsRepoMock } from "../mocks/repos/subscriptions.repo.mock";
import { transactionsServiceMock } from "../mocks/services/transactions.service.mock";
import { userServiceMock } from "../mocks/services/users.service.mock";
import { createSubscriptionDtoMock } from "./subscription.dto.mock";
import { SubscriptionModel } from "../../src/subscriptions/subscription.model";

describe('Subscriptions Service', () => {

  let sut: SubscriptionsService;

  beforeEach(() => {
    sut = new SubscriptionsService(
      subscriptionsRepoMock as any,
      transactionsServiceMock as any,
      userServiceMock as any
    )
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should throw BadRequest exception if subscription for given transaction already exists', () => {
    jest.spyOn(sut, 'findOneByTransactionId').mockResolvedValueOnce(testSubscriptions[0]);
    sut.createSubscription(
      members[0].getId(),
      testTransactions[0].getId(),
      createSubscriptionDtoMock
    ).catch(err => {
      expect(err).toBeInstanceOf(BadRequestException);
      expect(err.message).toBe('This transaction is already subscribed to.');
    });
  });

  it('should create a subscription', async () => {
    jest.spyOn(sut, 'findOneByTransactionId').mockResolvedValueOnce(undefined);
    const result = await sut.createSubscription(
      members[0].getId(),
      testTransactions[0].getId(),
      createSubscriptionDtoMock
    );

    expect(result).toBeInstanceOf(SubscriptionModel);
    expect(result).toEqual(testSubscriptions[0]);
  });

  it('should return subscription for current user', async () => {
    const result = await sut.getUserSubscriptions(members[0].getId());

    const expected = testSubscriptions;

    expect(result).toEqual(expected);
  });

  it('should return subscription by transactionId', async () => {
    const transactionId = testTransactions[0].getId();
    const result = await sut.findOneByTransactionId(transactionId);

    const expected = testSubscriptions[0];
    expect(result).toEqual(expected);
  });

  it('should throw NotFoundException if no subscription with provided id found', () => {
    jest.spyOn(subscriptionsRepoMock, 'findOne').mockResolvedValueOnce(undefined);
    const subscriptionId = testSubscriptions[0].getId();
    sut.findOne(subscriptionId).catch(err => {
      expect(err).toBeInstanceOf(NotFoundException);
      expect(err.message).toBe('Subscription not found');
    })
  });

  it('should return subscription by provided id', async () => {
    const subscriptionId = testSubscriptions[0].getId();
    const result = await sut.findOne(subscriptionId);

    const expected = testSubscriptions[0];

    expect(result).toEqual(expected);
  });

  it('should delete subscription by id', () => {
    const subscriptionId = testSubscriptions[0].getId();
    sut.deleteSubscription(subscriptionId);

    expect(subscriptionsRepoMock.delete).toHaveBeenCalledWith(subscriptionId);
  })
})