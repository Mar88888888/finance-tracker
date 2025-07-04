import { SubscriptionEntity } from "../../../src/subscriptions/subscription.entity";
import { testSubscriptionsEntities } from "../../fixtures/subscriptions.fixtures";

export const subscriptionsRepoMock = {
  findOne: jest.fn().mockResolvedValue(testSubscriptionsEntities[0]),
  find: jest.fn().mockResolvedValue(testSubscriptionsEntities),
  create: jest.fn().mockReturnValue(testSubscriptionsEntities[0]),
  save: jest.fn().mockImplementation(async (savedSubscriptionEntity: SubscriptionEntity): Promise<SubscriptionEntity>=>{
    return Promise.resolve(savedSubscriptionEntity);
  }),
  delete: jest.fn(),
}