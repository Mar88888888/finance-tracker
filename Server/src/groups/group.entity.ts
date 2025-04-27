import { PurposeEntity } from "../purposes/purpose.entity";
import { UserEntity } from "../users/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'group' })
export class GroupEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 100 })
  title: string;

  @ManyToOne(() => UserEntity, user => user.myGroups)
  owner: UserEntity;

  @ManyToMany(() => UserEntity)
  @JoinTable()
  members: UserEntity[];

  @ManyToMany(() => PurposeEntity)
  @JoinTable()
  purposes: PurposeEntity[];

  @Column({ unique: true })
  joinCode: string;
}
