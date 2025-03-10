import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupEntity } from './group.entity';
import { UpdateGroupDto } from './dto/update.group.dto';
import { CreateGroupDto } from './dto/create.group.dto';
import { UsersService } from 'src/users/users.service';
import { TransactionsService } from '../transactions/transactions.service';
import { GroupModel } from './group.model';
import { UserModel } from '../users/user.model';
import { TransactionModel } from '../transactions/transaction.model';
import { AddPurposeDto } from './dto/add-purpose.dto';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(GroupEntity)
    private groupRepo: Repository<GroupEntity>,
    private userService: UsersService,
    private transactionService: TransactionsService,
  ) { }

  async findById(id: number): Promise<GroupModel> {
    const groupEntity = await this.groupRepo.findOne({ where: { id }, relations: ['members', 'owner', 'purposes'] });
    if (!groupEntity) {
      throw new NotFoundException('Group not found');
    }
    return GroupModel.fromEntity(groupEntity);
  }

  async getGroupCode(id: number): Promise<string> {
    return (await this.findById(id)).getJoinCode();
  }

  async getUserGroups(userId: number): Promise<GroupModel[]> {
    const groupEntities = await this.groupRepo
      .createQueryBuilder('group')
      .innerJoin('group.members', 'member', 'member.id = :userId', { userId })
      .leftJoinAndSelect('group.members', 'allMembers')
      .leftJoinAndSelect('group.owner', 'owner')
      .getMany();

    return groupEntities.map(GroupModel.fromEntity);
  }




  async create(ownerId: number, createGroupDto: CreateGroupDto): Promise<GroupModel> {
    const newGroupEntity = this.groupRepo.create(createGroupDto);
    const owner = UserModel.toEntity(await this.userService.findOne(ownerId));
    newGroupEntity.owner = owner;
    newGroupEntity.joinCode = this.generateJoinCode();
    newGroupEntity.mindate = createGroupDto.mindate;
    newGroupEntity.maxdate = createGroupDto.maxdate;
    newGroupEntity.members = [owner];

    const savedGroupEntity = await this.groupRepo.save(newGroupEntity);
    return GroupModel.fromEntity(savedGroupEntity);
  }

  async joinGroup(joinCode: string, userId: number): Promise<GroupModel> {
    const groupEntity = await this.groupRepo.findOne({ where: { joinCode }, relations: ['members', 'owner'] });

    if (!groupEntity) {
      throw new NotFoundException('Group with this code not found');
    }

    const isMember = groupEntity.members.some(member => member.id === userId);
    if (isMember) {
      throw new ConflictException('User is already a member of this group');
    }

    const user = UserModel.toEntity(await this.userService.findOne(userId));

    groupEntity.members.push(user);

    const updatedGroupEntity = await this.groupRepo.save(groupEntity);

    return GroupModel.fromEntity(updatedGroupEntity);
  }

  async update(id: number, updateGroupDto: UpdateGroupDto): Promise<GroupModel> {
    const groupEntity = await this.findById(id);
    const { title } = updateGroupDto;

    await this.groupRepo
      .createQueryBuilder()
      .update(GroupEntity)
      .set({ title })
      .where('id = :id', { id })
      .execute();

    return this.findById(id);
  }

  private generateJoinCode(): string {
    return Math.random().toString(36).slice(2, 10);
  }

  async addPurposes(groupId: string, purposes: AddPurposeDto): Promise<GroupModel> {
    const group = await this.findById(parseInt(groupId));
    if (!group) {
      throw new NotFoundException('Group not found');
    }

    const { purposeIds } = purposes;
    group.addPurposes(purposeIds);

    await this.groupRepo.save(GroupModel.toEntity(group));


    return group;
  }

  async getTransactions(id: number): Promise<TransactionModel[]> {
    const group = await this.findById(id);

    const memberIds = group.getMembers().map(member => member.getId());
    const purposeIds = group.getPurposes();
    if (memberIds.length === 0 || purposeIds.length === 0) {
      return [];
    }

    return this.transactionService.getGroupTransactions(memberIds, purposeIds, group.getMindate(), group.getMaxdate());
  }


  async remove(id: number): Promise<GroupModel> {
    const groupEntity = await this.findById(id);

    await this.groupRepo.delete(groupEntity.getId());

    return groupEntity;
  }

  async removeUserFromGroup(group: GroupModel, memberId: number): Promise<GroupModel> {

    const member = await this.userService.findOne(memberId);
    if (!member) {
      throw new NotFoundException('User not found');
    }

    group.removeMember(member);

    await this.groupRepo.save(GroupModel.toEntity(group));

    return group;
  }

  async removePurposeFromGroup(group: GroupModel, purposeId: number): Promise<GroupModel> {

    group.removePurpose(purposeId);

    await this.groupRepo.save(GroupModel.toEntity(group));

    return group;
  }
}
