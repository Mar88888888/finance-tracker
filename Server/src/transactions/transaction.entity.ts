import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';
import { User } from '../users/user.entity';
import { Purpose } from '../purposes/purpose.entity';

@Entity({ name: 'transaction' })
@Unique(['sum', 'date', 'member', 'purpose'])
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  sum: number;

  @Column({ type: 'date', nullable: false })
  date: Date;

  @ManyToOne(() => User, user => user.transactions, { onDelete: 'CASCADE', nullable: false })
  member: User;

  @ManyToOne(() => Purpose, purpose => purpose.transactions, { onDelete: 'CASCADE', nullable: false  })
  purpose: Purpose;
}
