import { TransactionEntity } from '../transactions/transaction.entity';
import { SubscriptionEntity } from './subscription.entity';
import { AbstractSubscription } from './abstracts/subscription.model.abstract';
import { UserEntity } from '../users/user.entity';

export class SubscriptionModel extends AbstractSubscription {
  static fromEntity(entity: SubscriptionEntity): SubscriptionModel {
    return new SubscriptionModel(
      entity.id,
      entity.interval,
      entity.unit,
      entity.startDate,
      entity.nextExecutionDate,
      entity.isActive,
      entity.transactionTemplate.id,
      entity.user.id,
      entity.endDate,
    );
  }
  static toEntity(model: SubscriptionModel): SubscriptionEntity {
    const entity = new SubscriptionEntity();
    entity.id = model.id;
    entity.interval = model.interval;
    entity.unit = model.unit;
    entity.startDate = model.startDate;
    entity.nextExecutionDate = model.nextExecutionDate;
    entity.endDate = model.endDate;
    entity.isActive = model.isActive;
    entity.transactionTemplate = {
      id: model.transactionId,
    } as TransactionEntity;
    entity.user = { id: model.userId } as UserEntity;
    return entity;
  }
}
