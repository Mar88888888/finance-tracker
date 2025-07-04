import { testSubscriptions } from "../../fixtures/subscriptions.fixtures";

export const subscriptionsServiceMock = {
  getUserSubscriptions: jest.fn().mockResolvedValue(testSubscriptions),
  deleteSubscription: jest.fn(),
}