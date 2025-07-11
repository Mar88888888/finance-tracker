import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { TransactionEntity } from '../transactions/transaction.entity';
import { UserEntity } from '../users/user.entity';

@Entity({ name: 'trans_category' })
@Unique(['category', 'user'])
export class PurposeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, nullable: false })
  category: string;

  @OneToMany(/* istanbul ignore next */() => TransactionEntity, /* istanbul ignore next */transaction => transaction.purpose)
  transactions: TransactionEntity[];

  @ManyToOne(/* istanbul ignore next */() => UserEntity, /* istanbul ignore next */user => user.purposes, { onDelete: 'CASCADE', nullable: false })
  user: UserEntity;
}
