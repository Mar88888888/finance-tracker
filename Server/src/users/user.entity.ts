import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { TransactionEntity } from '../transactions/transaction.entity';
import { Exclude } from 'class-transformer';
import { GroupEntity } from '../groups/group.entity';
import { PurposeEntity } from '../purposes/purpose.entity';
import { SubscriptionEntity } from '../subscriptions/subscription.entity';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 80, nullable: false })
  name: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  @Exclude()
  password: string;

  @Column({ nullable: true })
  age: number;

  @Column({ nullable: true })
  gender: boolean;

  @Column({ nullable: true })
  @Exclude()
  verificationToken?: string;

  @OneToMany(
    /*istanbul ignore next*/ () => TransactionEntity,
    /*istanbul ignore next*/ (transaction) => transaction.member,
  )
  @Exclude()
  transactions: TransactionEntity[];

  @OneToMany(
    /*istanbul ignore next*/ () => GroupEntity,
    /*istanbul ignore next*/ (group) => group.owner,
  )
  @Exclude()
  ownedGroups: GroupEntity[];

  @ManyToMany(/*istanbul ignore next*/ () => GroupEntity)
  @JoinTable()
  groups: GroupEntity[];

  @OneToMany(
    /*istanbul ignore next*/ () => PurposeEntity,
    /*istanbul ignore next*/ (purpose) => purpose.user,
  )
  purposes: PurposeEntity[];

  @OneToMany(
    /*istanbul ignore next*/ () => SubscriptionEntity,
    /*istanbul ignore next*/ (subscription) => subscription.user,
  )
  subscriptions: SubscriptionEntity[];
}
