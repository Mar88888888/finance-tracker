import { RecurrenceUnit } from "../../src/subscriptions/subscription.entity"
import { SubscriptionModel } from "../../src/subscriptions/subscription.model";

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
    )
  })

  it('should create a subscription via contructor', () => {
    expect(sub).toBeDefined();
  });

  it('should set id', () => {
    const subId = 5;
    sub.setId(subId);

    expect(sub.getId()).toBe(subId);
  });

  it('should set interval', () => {
    const subInterval = 5;
    sub.setInterval(subInterval);

    expect(sub.getInterval()).toBe(subInterval);
  });

  it('should set unit', () => {
    const subUnit = RecurrenceUnit.MONTH;
    sub.setUnit(subUnit);

    expect(sub.getUnit()).toBe(subUnit);
  });

  it('should set startDate', () => {
    const startDate = new Date('09-09-2009');
    sub.setStartDate(startDate);

    expect(sub.getStartDate()).toBe(startDate);
  });

  it('should set nextExecutionDate', () => {
    const nextExecutionDate = new Date('09-09-2009');
    sub.setNextExecutionDate(nextExecutionDate);

    expect(sub.getNextExecutionDate()).toBe(nextExecutionDate);
  });

  it('should set endDate', () => {
    const endDate = new Date('09-09-2009');
    sub.setEndDate(endDate);

    expect(sub.getEndDate()).toBe(endDate);
  });

  it('should set isActive', () => {
    const isActive = false;
    sub.setActive(isActive);

    expect(sub.IsActive()).toBe(isActive);
  });

  it('should set transaction id', () => {
    const subTransactionId = 5;
    sub.setTransactionId(subTransactionId);

    expect(sub.getTransactionId()).toBe(subTransactionId);
  });

  it('should set user id', () => {
    const subUserId = 5;
    sub.setUserId(subUserId);

    expect(sub.getUserId()).toBe(subUserId);
  });
  
})