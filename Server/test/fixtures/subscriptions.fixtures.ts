import { SubscriptionModel } from "../../src/subscriptions/subscription.model";
import { RecurrenceUnit, SubscriptionEntity } from "../../src/subscriptions/subscription.entity";

export function createSubscriptionModels(): SubscriptionModel[] {
  return [
    new SubscriptionModel(
      1,
      2,
      RecurrenceUnit.DAY,
      new Date('01-01-2001'),
      new Date('01-01-2001'),
      true,
      11,
      10,
      new Date('02-02-2002'),
    ),
    new SubscriptionModel(
      2,
      4,
      RecurrenceUnit.MONTH,
      new Date('03-03-2003'),
      new Date('03-03-2003'),
      true,
      11,
      5,
      new Date('04-04-2004'),
    ),
  ];
}
export function createSubscriptionEntities(subscriptionModels: SubscriptionModel[]): SubscriptionEntity[] {
  return subscriptionModels.map(SubscriptionModel.toEntity);
}
