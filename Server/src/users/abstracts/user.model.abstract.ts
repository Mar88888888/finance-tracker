import { TransactionEntity } from '../../transactions/transaction.entity';
import { GroupEntity } from '../../groups/group.entity';
import { PurposeEntity } from '../../purposes/purpose.entity';

export abstract class AbstractUserModel {
  id: number;
  name: string;
  email: string;
  password: string;
  age: number;
  gender: boolean;
  transactions: TransactionEntity[] = [];
  ownedGroups: GroupEntity[] = [];
  groups: GroupEntity[] = [];
  purposes: PurposeEntity[] = [];
}
