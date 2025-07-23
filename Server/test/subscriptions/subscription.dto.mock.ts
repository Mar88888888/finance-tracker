import { CreateSubscriptionDto } from '../../src/subscriptions/dto/create-subscription.dto';
import { createSubscriptionModels } from '../fixtures/subscriptions.fixtures';

const subscriptionModels = createSubscriptionModels();

export const createSubscriptionDtoMock: CreateSubscriptionDto = {
  interval: subscriptionModels[0].interval,
  unit: subscriptionModels[0].unit,
  startDate: subscriptionModels[0].startDate,
  endDate: subscriptionModels[0].endDate,
};
