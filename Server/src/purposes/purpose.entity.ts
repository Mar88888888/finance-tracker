import { Column, Entity, PrimaryGeneratedColumn, Unique, OneToMany } from 'typeorm';
import { Transaction } from '../transactions/transaction.entity';

@Entity({ name: 'trans_category' }) 
@Unique(['category', 'type'])
export class Purpose {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, nullable: false })
  category: string;

  @Column({ nullable: false })
  type: boolean;

  @OneToMany(() => Transaction, transaction => transaction.purpose)
  transactions: Transaction[];
}
