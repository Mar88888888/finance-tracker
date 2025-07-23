import { RecurrenceUnit } from '../../src/subscriptions/subscription.entity';
import { SubscriptionModel } from '../../src/subscriptions/subscription.model';

describe('Subscription Model', () => {
  let sub: SubscriptionModel;

  const subscriptionModelParameters = {
    id: 1,
    interval: 3,
    unit: RecurrenceUnit.DAY,
    startDate: new Date('01-02-2003'),
    nextExecutionDate: new Date('01-02-2003'),
    isActive: true,
    transactionId: 10,
    userId: 5,
    endDate: new Date('01-02-2005'),
  };

  beforeEach(() => {
    sub = new SubscriptionModel(
      subscriptionModelParameters.id,
      subscriptionModelParameters.interval,
      subscriptionModelParameters.unit,
      subscriptionModelParameters.startDate,
      subscriptionModelParameters.nextExecutionDate,
      subscriptionModelParameters.isActive,
      subscriptionModelParameters.transactionId,
      subscriptionModelParameters.userId,
      subscriptionModelParameters.endDate,
    );
  });

  it('should create a subscription via contructor', () => {
    expect(sub).toBeDefined();
  });
});
