import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { PurposeEntity } from '../purposes/purpose.entity';

@Entity({ name: 'transaction' })
@Unique(['sum', 'date', 'member', 'purpose'])
export class TransactionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  sum: number;

  @Column({ type: 'date', nullable: false })
  date: Date;

  @ManyToOne(() => UserEntity, user => user.transactions, { onDelete: 'CASCADE', nullable: false })
  member: UserEntity;

  @ManyToOne(() => PurposeEntity, purpose => purpose.transactions, { onDelete: 'CASCADE', nullable: false  })
  purpose: PurposeEntity;
}
