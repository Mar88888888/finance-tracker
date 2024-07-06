import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Transaction } from '../transactions/transaction.entity';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 80, nullable: false })
  name: string;

  @Column({ nullable: false })
  age: number;

  @Column({ nullable: false })
  gender: boolean;

  @OneToMany(() => Transaction, transaction => transaction.member)
  transactions: Transaction[];
}
