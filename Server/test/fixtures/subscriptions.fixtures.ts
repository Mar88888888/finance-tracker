import { SubscriptionModel } from "../../src/subscriptions/subscription.model";
import { RecurrenceUnit, SubscriptionEntity } from "../../src/subscriptions/subscription.entity";

export function createSubscriptionModels(): SubscriptionModel[] {
  return [
    new SubscriptionModel(
      1,
      2,
      RecurrenceUnit.DAY,
      new Date(),
      new Date(),
      true,
      11,
      10,
      new Date(),
    ),
    new SubscriptionModel(
      2,
      4,
      RecurrenceUnit.MONTH,
      new Date(),
      new Date(),
      true,
      11,
      5,
      new Date(),
    ),
  ];
}
export function createSubscriptionEntities(subscriptionModels: SubscriptionModel[]): SubscriptionEntity[] {
  return subscriptionModels.map(SubscriptionModel.toEntity);
}
