import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupEntity } from './group.entity';
import { UpdateGroupDto } from './dto/update.group.dto';
import { CreateGroupDto } from './dto/create.group.dto';
import { UsersService } from '../users/users.service';
import { TransactionsService } from '../transactions/transactions.service';
import { GroupModel } from './group.model';
import { UserModel } from '../users/user.model';
import { TransactionModel } from '../transactions/transaction.model';
import { AddPurposeDto } from './dto/add-purpose.dto';
import * as crypto from 'crypto';
import { TransactionFilterDto } from '../transactions/dto/transaction-filter.dto';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupRepo: Repository<GroupEntity>,
    private readonly userService: UsersService,
    private readonly transactionService: TransactionsService,
  ) {}

  public generateJoinCode(): string {
    return crypto.randomBytes(4).toString('hex');
  }

  async findOne(id: number): Promise<GroupModel> {
    const groupEntity = await this.groupRepo.findOne({
      where: { id },
      relations: ['members', 'owner', 'purposes'],
    });
    if (!groupEntity) {
      throw new NotFoundException('Group not found');
    }
    return GroupModel.fromEntity(groupEntity);
  }

  async getGroupCode(id: number): Promise<string> {
    return (await this.findOne(id)).getJoinCode();
  }

  async getUserGroups(userId: number): Promise<GroupModel[]> {
    const groupEntities = await this.groupRepo.find({
      where: {
        members: {
          id: userId,
        },
      },
      relations: ['members', 'owner'],
    });

    return groupEntities.map(GroupModel.fromEntity);
  }

  async create(
    ownerId: number,
    createGroupDto: CreateGroupDto,
  ): Promise<GroupModel> {
    const newGroupEntity = this.groupRepo.create(createGroupDto);
    const owner = UserModel.toEntity(await this.userService.findOne(ownerId));
    newGroupEntity.owner = owner;
    newGroupEntity.joinCode = this.generateJoinCode();
    newGroupEntity.members = [owner];

    const savedGroupEntity = await this.groupRepo.save(newGroupEntity);
    return GroupModel.fromEntity(savedGroupEntity);
  }

  async joinGroup(joinCode: string, userId: number): Promise<GroupModel> {
    const groupEntity = await this.groupRepo.findOne({
      where: { joinCode },
      relations: ['members', 'owner'],
    });

    if (!groupEntity) {
      throw new NotFoundException('Group with this code not found');
    }

    const groupModel = GroupModel.fromEntity(groupEntity);

    const isMember = groupEntity.members.some((member) => member.id === userId);
    if (isMember) {
      return groupModel;
    }

    const user = await this.userService.findOne(userId);

    groupModel.addMember(user);

    const updatedGroupEntity = await this.groupRepo.save(
      GroupModel.toEntity(groupModel),
    );

    return GroupModel.fromEntity(updatedGroupEntity);
  }

  async update(
    id: number,
    updateGroupDto: UpdateGroupDto,
  ): Promise<GroupModel> {
    const group = GroupModel.toEntity(await this.findOne(id));
    Object.assign(group, updateGroupDto);
    return GroupModel.fromEntity(await this.groupRepo.save(group));
  }

  async addPurposes(
    groupId: number,
    purposes: AddPurposeDto,
  ): Promise<GroupModel> {
    const group = await this.findOne(groupId);

    const { purposeIds } = purposes;
    group.addPurposes(purposeIds);

    await this.groupRepo.save(GroupModel.toEntity(group));

    return group;
  }

  async getTransactions(
    id: number,
    filterParams: TransactionFilterDto,
  ): Promise<TransactionModel[]> {
    const group = await this.findOne(id);
    return this.transactionService.getGroupTransactions(group, filterParams);
  }

  async remove(id: number): Promise<void> {
    await this.groupRepo.delete(id);
  }

  async removeUserFromGroup(
    groupId: number,
    memberId: number,
  ): Promise<GroupModel> {
    let group = await this.findOne(groupId);

    group.removeMember(memberId);
    return GroupModel.fromEntity(
      await this.groupRepo.save(GroupModel.toEntity(group)),
    );
  }

  async removePurposeFromGroup(
    groupId: number,
    purposeId: number,
  ): Promise<GroupModel> {
    const group = await this.findOne(groupId);

    group.removePurpose(purposeId);
    return GroupModel.fromEntity(
      await this.groupRepo.save(GroupModel.toEntity(group)),
    );
  }
}
