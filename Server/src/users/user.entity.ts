import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { TransactionEntity } from '../transactions/transaction.entity';
import { Exclude } from 'class-transformer';
import { GroupEntity } from 'src/groups/group.entity';

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

  @Column({ nullable: false })
  age: number;

  @Column({ nullable: false })
  gender: boolean;

  @Column({ nullable: false, default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true })
  @Exclude()
  verificationToken?: string;

  @OneToMany(() => TransactionEntity, transaction => transaction.member)
  @Exclude()
  transactions: TransactionEntity[];

  @OneToMany(() => GroupEntity, group => group.owner)
  @Exclude()
  myGroups: GroupEntity[];

  @ManyToMany(() => GroupEntity)
  @JoinTable()
  groups: GroupEntity[];
}
