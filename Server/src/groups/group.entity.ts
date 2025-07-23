import { PurposeEntity } from '../purposes/purpose.entity';
import { UserEntity } from '../users/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'group' })
export class GroupEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 100 })
  title: string;

  @ManyToOne(
    /* istanbul ignore next */ () => UserEntity,
    /* istanbul ignore next */ (user) => user.ownedGroups,
  )
  owner: UserEntity;

  @ManyToMany(/* istanbul ignore next */ () => UserEntity)
  @JoinTable()
  members: UserEntity[];

  @ManyToMany(/* istanbul ignore next */ () => PurposeEntity)
  @JoinTable()
  purposes: PurposeEntity[];

  @Column({ unique: true })
  joinCode: string;
}
