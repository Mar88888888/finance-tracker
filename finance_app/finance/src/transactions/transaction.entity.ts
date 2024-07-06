import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Purpose } from '../purposes/purpose.entity';

@Entity({ name: 'transaction' })
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  sum: number;

  @Column({ type: 'date', nullable: false })
  t_date: Date;


  @ManyToOne(() => User, user => user.transactions, { onDelete: 'CASCADE', nullable: false })
  member: User;

  @ManyToOne(() => Purpose, purpose => purpose.transactions, { onDelete: 'CASCADE', nullable: false  })
  purpose: Purpose;
}
