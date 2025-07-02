import { FindManyOptions } from "typeorm";
import { GroupsService } from "../../src/groups/groups.service";
import { UserModel } from "../../src/users/user.model";
import { GroupEntity } from "../../src/groups/group.entity";
import { CreateGroupDto } from "../../src/groups/dto/create.group.dto";
import { TransactionModel } from "../../src/transactions/transaction.model";
import { TransactionFilterDto } from "../../src/transactions/dto/transaction-filter.dto";
import { NotFoundException } from "@nestjs/common";
import * as crypto from 'crypto'
import { members } from "../fixtures/users.fixture";
import { groupEntities, groupModels } from "../fixtures/groups.fixtures";
import { testTransactions } from "../fixtures/transactions.fixtures";

jest.spyOn(crypto, 'randomBytes').mockImplementation((size: number) => Buffer.from('12345678', 'hex'));




const groupRepoMock = {
  findOne: jest.fn().mockImplementation(async (params: {where: {id?: number, joinCode?: string}, relations?: string[]}): Promise<GroupEntity>=>{
    const id = params.where.id;
    const joinCode = params.where.joinCode;
    const result = groupEntities.filter(group => group.id === id || group.joinCode === joinCode)[0];
    if(result === undefined){
      return null
    }
    return Promise.resolve(result);
  }),
  find: jest.fn().mockImplementation(async (options?: FindManyOptions<GroupEntity>): Promise<GroupEntity[]>=>{
    return Promise.resolve(groupEntities);
  }),
  create: jest.fn().mockImplementation((createGroupDto: CreateGroupDto): GroupEntity=>{
    let entity = new GroupEntity();
    entity.id = 1;
    entity.title = createGroupDto.title;
    return entity;
  }),
  save: jest.fn().mockImplementation(async (savedGroupEntity: GroupEntity): Promise<GroupEntity>=>{
    return Promise.resolve(savedGroupEntity);
  }),
  delete: jest.fn(),
}

const userServiceMock = {
  findOne: jest.fn().mockImplementation(async (id): Promise<UserModel>=>{
    return Promise.resolve(members.filter(member => member.getId() === id)[0])
  }),
}

const transactionServiceMock = {
  getGroupTransactions: jest.fn()
    .mockImplementation(
      async (memberIds: number[], purposeIds: number[], filterParams: TransactionFilterDto): Promise<TransactionModel[]>=>{
    return Promise.resolve(testTransactions);
  }),
}

describe('Group Service', ()=>{
  let sut: GroupsService;

  beforeEach(()=>{
    sut = new GroupsService(
      groupRepoMock as any,
      userServiceMock as any,
      transactionServiceMock as any
    )
  });

  afterEach(()=>{
    jest.clearAllMocks();
  })

  it('should be defined', ()=>{
    expect(sut).toBeDefined();
  });

  it('should generate a join code', ()=>{
    const result = sut.generateJoinCode();
    expect(result).toBeDefined();
    expect(result).toBe('12345678');
  })

  it('should return a group from findOne', async ()=>{
    const groupId = 1;
    const result = await sut.findOne(groupId);
    expect(result).toEqual(groupModels[0]);
    expect(groupRepoMock.findOne).toHaveBeenCalledTimes(1);
  });

  it('should throw a NotFoundException if group with given Id not found', ()=>{
    const groupId = -2;
    sut.findOne(groupId).catch(err => expect(err).toBeInstanceOf(NotFoundException));
  });

  it('should return a valid group Code', async ()=>{
    const group = groupModels[0];
    const result = await sut.getGroupCode(group.getId());
    expect(result).toBe(group.getJoinCode());
  });

  it('should return groups for specific user', async ()=>{
    const userId = members[0].getId();
    const result = await sut.getUserGroups(userId);
    expect(result).toEqual(groupModels);
  });

  it('should return empty array if groups not found', async ()=>{
    const userId = members[0].getId() + 1500;
    jest.spyOn(groupRepoMock, 'find').mockImplementation(async () => {
      if(members.filter(member => member.getId() === userId).length === 0){
        return Promise.resolve([]);
      }
      else return Promise.resolve(groupModels[0]);
    });
    const result = await sut.getUserGroups(userId);
    expect(result).toEqual([]);
  });

  it('should create a group', async ()=>{
    const joinCode = 'GeneratedJoinCode'
    jest.spyOn(sut, 'generateJoinCode').mockImplementation(()=> joinCode);
    
    let groupParams = {
      title: 'GroupTitle',
    };

    const result = await sut.create(members[0].getId(), groupParams);
    expect(result.getJoinCode()).toBe(joinCode);
    expect(result.getTitle()).toBe(groupParams.title);
    expect(result.getId()).toBeDefined();
    expect(result.getOwner()).toEqual(members[0]);
    expect(result.getMembers()).toEqual([members[0]]);
  });

  it('should add user to a group', async () =>{
    const result = await sut.joinGroup(groupModels[1].getJoinCode(), members[1].getId());

    expect(result.getMembers().filter(member => member.getId() === members[1].getId())[0]).toEqual(members[1]);
    expect(groupRepoMock.save).toHaveBeenCalled();
  });

  it('should throw a NotFoundException if invalid joinCode provided', async ()=>{
    const result = sut.joinGroup('SomeRandomCode ', members[1].getId());

    result.catch(error => {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('Group with this code not found');
      expect(groupRepoMock.save).toHaveBeenCalledTimes(0);
    });
  });
  
  it('should return unchanged group if user is already a member of the group', async ()=>{
    const result = await sut.joinGroup(groupModels[0].getJoinCode(), members[0].getId());
    expect(result).toEqual(groupModels[0]);
    expect(groupRepoMock.save).toHaveBeenCalledTimes(0);
  });

  it('should update a group', async ()=>{
    const result = await sut.update(groupModels[0].getId(), {title: 'New Title'});

    expect(result.getTitle()).toBe('New Title');
    expect(groupRepoMock.save).toHaveBeenCalled();
  })

  it('should add purposes to group', async ()=> {
    const purposeIds = [1, 2];
    const result = await sut.addPurposes(groupModels[0].getId(), {purposeIds});

    expect(result.getPurposes().sort()).toEqual(purposeIds.sort());
    expect(groupRepoMock.save).toHaveBeenCalledTimes(1);
  });

  it('should return an empty array if no transactions available', async ()=>{
    const result = await sut.getTransactions(2, undefined);
    expect(result).toBeDefined();
    expect(result).toHaveLength(0);
  });

  it('should return group transactions available', async ()=>{
    const result = await sut.getTransactions(1, {});
    expect(result).toBeDefined();
    expect(result).toEqual(testTransactions);
  });

  it('should delete a group on remove call', async () =>{
    const groupId = 1
    await sut.remove(groupId);

    expect(groupRepoMock.delete).toHaveBeenCalledWith(groupId);
    expect(groupRepoMock.delete).toHaveBeenCalledTimes(1);
  });

  it('should remove a member from a group', async ()=>{
    const groupId = 1, userId = 5;
    const result = await sut.removeUserFromGroup(groupId, userId);
    expect(result.getMembers().filter(member => member.getId() === userId)).toHaveLength(0);
  });

  it('should remove a purpose from a group', async ()=>{
    const groupId = 1, testPurposeId = 2;
    const result = await sut.removePurposeFromGroup(groupId, testPurposeId);
    expect(result.getPurposes().filter(purposeId => purposeId === testPurposeId)).toHaveLength(0);
  });
});
