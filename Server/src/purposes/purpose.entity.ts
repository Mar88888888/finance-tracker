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
@Unique(['category', 'type'])
export class PurposeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, nullable: false })
  category: string;

  @Column({ nullable: false })
  type: boolean;

  @OneToMany(() => TransactionEntity, transaction => transaction.purpose)
  transactions: TransactionEntity[];

  @ManyToOne(() => UserEntity, user => user.purposes, { onDelete: 'CASCADE', nullable: false })
  user: UserEntity;
}
