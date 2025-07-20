import { SubscriptionEntity } from '../../../src/subscriptions/subscription.entity';
import {
  createSubscriptionEntities,
  createSubscriptionModels,
} from '../../fixtures/subscriptions.fixtures';
import { RepoMock } from './repo.mock.interface';

const subscriptionModels = createSubscriptionModels();
const subscriptionEntities = createSubscriptionEntities(subscriptionModels);

export const subscriptionsRepoMock: RepoMock<SubscriptionEntity> = {
  findOne: jest.fn().mockResolvedValue(subscriptionEntities[0]),
  find: jest.fn().mockResolvedValue(subscriptionEntities),
  create: jest.fn().mockReturnValue(subscriptionEntities[0]),
  save: jest
    .fn()
    .mockImplementation(async (entity: SubscriptionEntity) =>
      Promise.resolve(entity),
    ),
  delete: jest.fn(),
};
