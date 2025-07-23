import { RecurrenceUnit } from '../subscription.entity';

export abstract class AbstractSubscription {
  constructor(
    public id: number,
    public interval: number,
    public unit: RecurrenceUnit,
    public startDate: Date,
    public nextExecutionDate: Date,
    public isActive: boolean,
    public transactionId: number,
    public userId: number,
    public endDate?: Date,
  ) {}
}
