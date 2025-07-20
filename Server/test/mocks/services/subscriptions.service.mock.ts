import { createSubscriptionModels } from '../../fixtures/subscriptions.fixtures';

const subscriptionModels = createSubscriptionModels();

export const subscriptionsServiceMock = {
  findOne: jest.fn().mockResolvedValue(subscriptionModels[0]),
  createSubscription: jest.fn().mockResolvedValue(subscriptionModels[0]),
  getUserSubscriptions: jest.fn().mockResolvedValue(subscriptionModels),
  deleteSubscription: jest.fn(),
};
