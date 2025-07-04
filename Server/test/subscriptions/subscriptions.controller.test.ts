import { SubscriptionsController } from "../../src/subscriptions/subscriptions.controller"
import { testSubscriptions } from "../fixtures/subscriptions.fixtures";
import { authorizedRequest } from "../mocks/authorized-request.mock";
import { subscriptionsServiceMock } from "../mocks/services/subscriptions.service.mock";

describe('Subscriptions Controller', () => {
  let sut: SubscriptionsController;

  beforeEach(() => {
    sut = new SubscriptionsController(
      subscriptionsServiceMock as any,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  it('should return user subscriptions', async () => {
    const result = await sut.getUserSubscriptions(authorizedRequest);

    const expected = testSubscriptions;

    expect(result).toEqual(expected);
  });

  it('should delete a user subscription', async () => {
    const subscriptionId = testSubscriptions[0].getId();

    await sut.deleteSubscription(subscriptionId);

    expect(subscriptionsServiceMock.deleteSubscription).toHaveBeenCalledWith(subscriptionId);
  })
})