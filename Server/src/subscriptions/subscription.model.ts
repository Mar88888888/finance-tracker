import { TransactionEntity } from '../transactions/transaction.entity';
import { SubscriptionEntity } from './subscription.entity';
import { AbstractSubscription } from './abstracts/subscription.model.abstract';
import { UserEntity } from '../users/user.entity';

export class SubscriptionModel extends AbstractSubscription {
  static fromEntity(entity: SubscriptionEntity): SubscriptionModel {
    const model = new SubscriptionModel();
    model.setId(entity.id);
    model.setInterval(entity.interval);
    model.setUnit(entity.unit);
    model.setStartDate(entity.startDate);
    model.setNextExecutionDate(entity.nextExecutionDate);
    model.setEndDate(entity.endDate);
    model.setIsActive(entity.isActive);
    model.setTransactionId(entity.transactionTemplate.id);
    model.setUserId(entity.user.id);
    return model;
  }
  static toEntity(model: SubscriptionModel): SubscriptionEntity {
    const entity = new SubscriptionEntity();
    entity.id = model.getId();
    entity.interval = model.getInterval();
    entity.unit = model.getUnit();
    entity.startDate = model.getStartDate();
    entity.nextExecutionDate = model.getNextExecutionDate();
    entity.endDate = model.getEndDate();
    entity.isActive = model.getIsActive();
    entity.transactionTemplate = { id: model.getTransactionId() } as TransactionEntity; 
    entity.user = { id: model.getUserId() } as UserEntity;
    return entity;
  }
  

}
