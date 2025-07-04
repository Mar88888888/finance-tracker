import { SubscriptionModel } from "../../src/subscriptions/subscription.model";
import { RecurrenceUnit } from "../../src/subscriptions/subscription.entity";

export const testSubscriptions: SubscriptionModel[] = [
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

export const testSubscriptionsEntities = testSubscriptions.map(sub => SubscriptionModel.toEntity(sub));