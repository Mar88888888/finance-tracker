import { SubscriptionEntity } from "../../../src/subscriptions/subscription.entity";
import { createSubscriptionEntities, createSubscriptionModels } from "../../fixtures/subscriptions.fixtures";

const subscriptionModels = createSubscriptionModels();
const subscriptionEntities = createSubscriptionEntities(subscriptionModels);

export const subscriptionsRepoMock = {
  findOne: jest.fn().mockResolvedValue(subscriptionEntities[0]),
  find: jest.fn().mockResolvedValue(subscriptionEntities),
  create: jest.fn().mockReturnValue(subscriptionEntities[0]),
  save: jest.fn().mockImplementation(async (savedSubscriptionEntity: SubscriptionEntity): Promise<SubscriptionEntity>=>{
    return Promise.resolve(savedSubscriptionEntity);
  }),
  delete: jest.fn(),
}