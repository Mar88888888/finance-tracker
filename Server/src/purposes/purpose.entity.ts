import { Column, Entity, PrimaryGeneratedColumn, Unique, OneToMany } from 'typeorm';
import { TransactionEntity } from '../transactions/transaction.entity';

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
}
