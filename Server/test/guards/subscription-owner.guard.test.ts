import { ExecutionContext, ForbiddenException, NotFoundException, } from "@nestjs/common";
import { members } from "../fixtures/users.fixture";
import { testSubscriptions } from "../fixtures/subscriptions.fixtures";
import { SubscriptionOwnerGuard } from "../../src/guards/subscription-owner.guard";

const subscriptionServiceMock = {
  findOne: jest.fn().mockResolvedValue(testSubscriptions[0])
};

const executionContextMock: Partial<
  Record<
    jest.FunctionPropertyNames<ExecutionContext>,
    jest.MockedFunction<any>
  >
> = {
  switchToHttp: jest.fn().mockReturnValue({
    getRequest: jest.fn().mockReturnValue({
      userId: members[0].getId(),
      params: {
        subscriptionId: testSubscriptions[0].getId(),
      }
    }),
    getResponse: jest.fn(),
  }),
};


describe('Auth Guard', () => {
  let sut: SubscriptionOwnerGuard;

  beforeEach(() => {
    sut = new SubscriptionOwnerGuard(
      subscriptionServiceMock as any
    );
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

  it('should throw NotFoundException if no subscriptionId provided',  () => {
    jest.spyOn(executionContextMock, 'switchToHttp').mockReturnValueOnce({
      getRequest: jest.fn().mockReturnValueOnce({
        userId: members[0].getId(),
        params: {
          subscriptionId: undefined,
        }
      }),
      getResponse: jest.fn(),
    })
    sut.canActivate(executionContextMock as any).catch(err => {
      expect(err).toBeInstanceOf(NotFoundException);
      expect(err.message).toBe('Subscription ID is required');
    });
  });

  it('should throw NotFoundException if no subscription with provided Id found',  () => {
    jest.spyOn(subscriptionServiceMock, 'findOne').mockResolvedValueOnce(undefined);
    sut.canActivate(executionContextMock as any).catch(err => {
      expect(err).toBeInstanceOf(NotFoundException);
      expect(err.message).toBe('Subscription not found');
    });
  });

  it('should throw ForbiddenException if user is not an owner of provided subscription',  () => {
    jest.spyOn(subscriptionServiceMock, 'findOne').mockResolvedValueOnce(testSubscriptions[1]);
    sut.canActivate(executionContextMock as any).catch(err => {
      expect(err).toBeInstanceOf(ForbiddenException);
      expect(err.message).toBe('You are not the owner of this subscription');
    });
  });
})