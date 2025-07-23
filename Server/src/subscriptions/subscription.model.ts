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
    entity.interval = model.getInterval();
    entity.unit = model.getUnit();
    entity.startDate = model.getStartDate();
    entity.nextExecutionDate = model.getNextExecutionDate();
    entity.endDate = model.getEndDate();
    entity.isActive = model.IsActive();
    entity.transactionTemplate = {
      id: model.getTransactionId(),
    } as TransactionEntity;
    entity.user = { id: model.getUserId() } as UserEntity;
    return entity;
  }
}
