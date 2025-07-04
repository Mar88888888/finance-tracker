import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { TransactionEntity } from '../transactions/transaction.entity';
import { UserEntity } from '../users/user.entity';

export enum RecurrenceUnit {
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  YEAR = 'YEAR',
}

@Entity({ name: 'subsctiption' })
export class SubscriptionEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  interval: number;

  @Column({ type: 'enum', enum: RecurrenceUnit })
  unit: RecurrenceUnit;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  nextExecutionDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate?: Date;

  @Column({ default: true })
  isActive: boolean;

  @OneToOne(/* istanbul ignore next */() => TransactionEntity,/* istanbul ignore next */ { cascade: true })
  @JoinColumn()
  transactionTemplate: TransactionEntity;

  @ManyToOne(/* istanbul ignore next */() => UserEntity,/* istanbul ignore next */ user => user.subscriptions, { nullable: false, onDelete: 'CASCADE', })
  user: UserEntity;
}
