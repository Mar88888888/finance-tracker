import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { PurposeEntity } from '../purposes/purpose.entity';
import { CurrencyEntity } from '../currency/currency.entity';

@Entity({ name: 'transaction' })
@Unique(['sum', 'date', 'member', 'purpose'])
export class TransactionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  sum: number;

  @ManyToOne(/*istanbul ignore next */ () => CurrencyEntity, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'currency', referencedColumnName: 'code' })
  currency: CurrencyEntity;

  @Column('decimal', { name: 'usd_equivalent', nullable: true, default: 1 })
  usdEquivalent: number;

  @Column({ type: 'date', nullable: false })
  date: Date;

  @ManyToOne(
    /*istanbul ignore next */ () => UserEntity,
    /*istanbul ignore next */ (user) => user.transactions,
    { onDelete: 'CASCADE', nullable: false },
  )
  member: UserEntity;

  @ManyToOne(
    /*istanbul ignore next */ () => PurposeEntity,
    /*istanbul ignore next */ (purpose) => purpose.transactions,
    { onDelete: 'CASCADE', nullable: false },
  )
  purpose: PurposeEntity;
}
