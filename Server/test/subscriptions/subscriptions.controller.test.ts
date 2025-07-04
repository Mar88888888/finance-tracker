import { SubscriptionModel } from "../../src/subscriptions/subscription.model";
import { SubscriptionsController } from "../../src/subscriptions/subscriptions.controller"
import { createSubscriptionModels } from "../fixtures/subscriptions.fixtures";
import { authorizedRequest } from "../mocks/authorized-request.mock";
import { subscriptionsServiceMock } from "../mocks/services/subscriptions.service.mock";

describe('Subscriptions Controller', () => {
  let sut: SubscriptionsController;
  let subscriptionModels: SubscriptionModel[];

  beforeEach(() => {
    sut = new SubscriptionsController(
      subscriptionsServiceMock as any,
    );

    subscriptionModels = createSubscriptionModels();
    
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  it('should return user subscriptions', async () => {
    const result = await sut.getUserSubscriptions(authorizedRequest);

    const expected = subscriptionModels;

    expect(result).toEqual(expected);
  });

  it('should delete a user subscription', async () => {
    const subscriptionId = subscriptionModels[0].getId();

    await sut.deleteSubscription(subscriptionId);

    expect(subscriptionsServiceMock.deleteSubscription).toHaveBeenCalledWith(subscriptionId);
  })
})