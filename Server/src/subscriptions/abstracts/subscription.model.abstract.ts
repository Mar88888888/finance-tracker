import { RecurrenceUnit } from "../subscription.entity";

export abstract class AbstractSubscription {
  constructor(
    protected id: number,
    protected interval: number,
    protected unit: RecurrenceUnit,
    protected startDate: Date,
    protected nextExecutionDate: Date,
    protected isActive: boolean,
    protected transactionId: number,
    protected userId: number,
    protected endDate?: Date,
  ){}


  getId(): number {
    return this.id;
  }

  setId(id: number): void {
    this.id = id;
  }

  getInterval(): number {
    return this.interval;
  }

  setInterval(interval: number): void {
    this.interval = interval;
  }

  getUnit(): RecurrenceUnit {
    return this.unit;
  }

  setUnit(unit: RecurrenceUnit): void {
    this.unit = unit;
  }
  getStartDate(): Date {
    return this.startDate;
  }
  setStartDate(startDate: Date): void {
    this.startDate = startDate;
  }
  getNextExecutionDate(): Date {
    return this.nextExecutionDate;
  }
  setNextExecutionDate(nextExecutionDate: Date): void {
    this.nextExecutionDate = nextExecutionDate;
  }
  getEndDate(): Date | undefined {
    return this.endDate;
  }
  setEndDate(endDate: Date | undefined): void {
    this.endDate = endDate;
  }
  IsActive(): boolean {
    return this.isActive;
  }
  setActive(isActive: boolean): void {
    this.isActive = isActive;
  }
  getTransactionId(): number {
    return this.transactionId;
  }
  setTransactionId(transactionId: number): void {
    this.transactionId = transactionId;
  }
  getUserId(): number {
    return this.userId;
  }
  setUserId(userId: number): void {
    this.userId = userId;
  }
}
