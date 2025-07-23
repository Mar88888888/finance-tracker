import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { SubscriptionOwnerGuard } from '../../src/guards/subscription-owner.guard';
import { UserModel } from '../../src/users/user.model';
import { subscriptionsServiceMock } from '../mocks/services/subscriptions.service.mock';
import { createUserModels } from '../fixtures/users.fixture';
import { executionContextMock } from '../mocks/execution-context.mock';
import { createSubscriptionModels } from '../fixtures/subscriptions.fixtures';
import { SubscriptionModel } from '../../src/subscriptions/subscription.model';

describe('Auth Guard', () => {
  let sut: SubscriptionOwnerGuard;
  let userModels: UserModel[];
  let subscriptionModels: SubscriptionModel[];

  beforeEach(() => {
    sut = new SubscriptionOwnerGuard(subscriptionsServiceMock as any);

    userModels = createUserModels();
    subscriptionModels = createSubscriptionModels();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should return true if user is an owner of given subsctiprion', async () => {
    const result = await sut.canActivate(executionContextMock as any);
    expect(result).toBe(true);
  });

  it('should throw NotFoundException if no subscriptionId provided', () => {
    jest.spyOn(executionContextMock, 'switchToHttp').mockReturnValueOnce({
      getRequest: jest.fn().mockReturnValueOnce({
        userId: userModels[0].id,
        params: {
          subscriptionId: undefined,
        },
      }),
      getResponse: jest.fn(),
    });
    sut.canActivate(executionContextMock as any).catch((err) => {
      expect(err).toBeInstanceOf(NotFoundException);
      expect(err.message).toBe('Subscription ID is required');
    });
  });

  it('should throw NotFoundException if no subscription with provided Id found', () => {
    subscriptionsServiceMock.findOne.mockResolvedValueOnce(undefined);
    sut.canActivate(executionContextMock as any).catch((err) => {
      expect(err).toBeInstanceOf(NotFoundException);
      expect(err.message).toBe('Subscription not found');
    });
  });

  it('should throw ForbiddenException if user is not an owner of provided subscription', () => {
    subscriptionsServiceMock.findOne.mockResolvedValueOnce(
      subscriptionModels[1],
    );
    sut.canActivate(executionContextMock as any).catch((err) => {
      expect(err).toBeInstanceOf(ForbiddenException);
      expect(err.message).toBe('You are not the owner of this subscription');
    });
  });
});
