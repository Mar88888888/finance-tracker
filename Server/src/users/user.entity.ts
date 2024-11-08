import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Transaction } from '../transactions/transaction.entity';
import { Exclude } from 'class-transformer';
import { Group } from 'src/groups/group.entity';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 80, nullable: false })
  name: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  @Exclude()
  password: string;

  @Column({ nullable: false })
  age: number;

  @Column({ nullable: false })
  gender: boolean;

  @Column({ nullable: false, default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true })
  @Exclude()
  verificationToken?: string;

  @OneToMany(() => Transaction, transaction => transaction.member)
  @Exclude()
  transactions: Transaction[];

  @OneToMany(() => Group, group => group.owner)
  @Exclude()
  myGroups: Group[];

  @ManyToMany(() => Group)
  @JoinTable()
  groups: Group[];
}
