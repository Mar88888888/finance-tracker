import { User } from "src/users/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 100 })
  title: string;

  @ManyToOne(() => User, user => user.myGroups)
  owner: User;

  @ManyToMany(() => User)
  @JoinTable()
  members: User[];

  @Column({ unique: true })
  joinCode: string;
}
