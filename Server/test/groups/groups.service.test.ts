import { GroupsService } from "../../src/groups/groups.service";
import { NotFoundException } from "@nestjs/common";
import * as crypto from 'crypto'
import { createUserEntities, createUserModels } from "../fixtures/users.fixture";
import { createGroupEntities, createGroupModels } from "../fixtures/groups.fixtures";
import { usersServiceMock } from "../mocks/services/users.service.mock";
import { transactionsServiceMock } from "../mocks/services/transactions.service.mock";
import { GroupModel } from "../../src/groups/group.model";
import { UserModel } from "../../src/users/user.model";
import { UserEntity } from "../../src/users/user.entity";
import { GroupEntity } from "../../src/groups/group.entity";
import { TransactionModel } from "../../src/transactions/transaction.model";
import { createTransactionModels } from "../fixtures/transactions.fixtures";
import { createGroupRepoMock } from "../mocks/repos/groups.repo.mock";

jest.spyOn(crypto, 'randomBytes').mockImplementation((size: number) => Buffer.from('12345678', 'hex'));

describe('Group Service', ()=>{
  let sut: GroupsService;

  let userModels: UserModel[];
  let groupModels: GroupModel[];
  let transactionModels: TransactionModel[];
  

  let userEntities: UserEntity[];
  let groupEntities: GroupEntity[];
  let groupRepoMock;

  beforeEach(()=>{
    userModels = createUserModels();
    groupModels = createGroupModels();
    transactionModels = createTransactionModels();

    userEntities = createUserEntities(userModels);
    groupEntities = createGroupEntities(groupModels);

    groupRepoMock = createGroupRepoMock(groupEntities);
    
    sut = new GroupsService(
      groupRepoMock as any,
      usersServiceMock as any,
      transactionsServiceMock as any
    );
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

  it('should throw a NotFoundException if group with given Id not found', async () => {
    groupRepoMock.findOne.mockResolvedValueOnce(null);
    const groupId = -2;
    await expect(sut.findOne(groupId)).rejects.toBeInstanceOf(NotFoundException);
  });


  it('should return a valid group Code', async ()=>{
    const group = groupModels[0];
    const result = await sut.getGroupCode(group.getId());
    expect(result).toBe(group.getJoinCode());
  });

  it('should return groups for specific user', async ()=>{
    const userId = userModels[0].getId();
    const result = await sut.getUserGroups(userId);
    expect(result).toEqual(groupModels);
  });

  it('should return empty array if groups not found', async ()=>{
    const userId = -5;
    groupRepoMock.find.mockResolvedValueOnce([]);
    const result = await sut.getUserGroups(userId);
    expect(result).toEqual([]);
  });

  it('should create a group', async ()=>{
    const joinCode = 'GeneratedJoinCode2';
    jest.spyOn(sut, 'generateJoinCode').mockImplementationOnce(()=> joinCode);
    
    let groupParams = {
      title: 'GroupTitle',
    };

    const result = await sut.create(userModels[0].getId(), groupParams);
    
    expect(result.getJoinCode()).toBe(joinCode);
    expect(result.getTitle()).toBe(groupParams.title);
    expect(result.getId()).toBeDefined();
    expect(result.getOwner()).toEqual(userModels[0]);
    expect(result.getMembers()).toEqual([userModels[0]]);
  });

  it('should add user to a group', async () =>{
    const joinCode = groupModels[2].getJoinCode();
    const userId = userModels[0].getId();
    
    groupRepoMock.findOne.mockResolvedValueOnce(groupEntities[2])
    
    const result = await sut.joinGroup(joinCode, userId);

    const updatedGroup = GroupModel.toEntity(groupModels[2]);
    updatedGroup.members = [userEntities[0]];

    expect(groupRepoMock.findOne).toHaveBeenCalledWith({
       where: { joinCode },
       relations: ['members', 'owner']
      })
    expect(usersServiceMock.findOne).toHaveBeenCalledWith(userId);
    expect(groupRepoMock.save).toHaveBeenCalledWith(updatedGroup);
    expect(result.getMembers()).toEqual([userModels[0]]);
  });

  it('should throw a NotFoundException if invalid joinCode provided', async ()=> {
    groupRepoMock.findOne.mockResolvedValueOnce(null);

    await expect(sut.joinGroup('SomeRandomCode', userModels[1].getId()))
      .rejects.toThrow(new NotFoundException('Group with this code not found'));

    expect(groupRepoMock.save).not.toHaveBeenCalled();
  });

  
  it('should return unchanged group if user is already a member of the group', async ()=>{
    const joinCode = groupModels[0].getJoinCode();
    const result = await sut.joinGroup(joinCode, userModels[0].getId());

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

  it('should return an empty array if no transactions available', async () => {
    transactionsServiceMock.getGroupTransactions.mockResolvedValueOnce([]);
    const result = await sut.getTransactions(2, undefined);
    expect(result).toBeDefined();
    expect(result).toHaveLength(0);    
  });
  
  it('should return an empty array if group has no members or purposes', async () => {
    jest.spyOn(sut, 'findOne').mockResolvedValueOnce(groupModels[2]);
    const result = await sut.getTransactions(2, undefined);
    expect(result).toBeDefined();
    expect(result).toHaveLength(0);    
  });

  it('should return group transactions available', async ()=>{
    const result = await sut.getTransactions(1, {});
    expect(result).toBeDefined();
    expect(result).toEqual(transactionModels);
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
