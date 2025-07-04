import { GroupModel } from "../../src/groups/group.model";
import { GroupsController } from "../../src/groups/groups.controller"
import { TransactionModel } from "../../src/transactions/transaction.model";
import { createGroupModels } from "../fixtures/groups.fixtures";
import { createTransactionModels } from "../fixtures/transactions.fixtures";
import { authorizedRequest } from "../mocks/authorized-request.mock";
import { res } from "../mocks/response.mock";
import { groupsServiceMock } from "../mocks/services/groups.service.mock";
import { transactionsServiceMock } from "../mocks/services/transactions.service.mock";


describe('Groups Controller', ()=>{
  let sut: GroupsController;
  let groupModels: GroupModel[]; 
  let transactionModels: TransactionModel[];


  beforeEach(()=>{
    sut = new GroupsController(
      groupsServiceMock as any,
      transactionsServiceMock as any,
    );

    groupModels = createGroupModels();
    transactionModels = createTransactionModels();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  
  it('should be defined', () =>{
    expect(sut).toBeDefined();
  });

  it('should return a join code', async ()=>{
    const result = await sut.getJoinCode(1);
    expect(result).toBe('gorupCode');
    expect(groupsServiceMock.getGroupCode).toHaveBeenCalledTimes(1);
  });
  
  it('should return group transactions', async ()=>{
    const result = await sut.getTransactions(1, {});
    expect(result).toEqual(transactionModels)
    expect(groupsServiceMock.getTransactions).toHaveBeenCalledTimes(1);
  });

  it('should export transactions to csv', async () => {
    await sut.exportGroupTransactions({}, 1, res as any);
    expect(transactionsServiceMock.exportToCsv).toHaveBeenCalledTimes(1);
  });

  it('should return a group by Id', async () => {
    const groupId = 1;
    const result = await sut.getById(groupId);
    expect(groupsServiceMock.findOne).toHaveBeenCalledWith(groupId);
    expect(result).toEqual(groupModels[0]);
  });

  it('should return groups for specific user', async () => {
    const result = await sut.getUserGroups(authorizedRequest);
    expect(groupsServiceMock.getUserGroups).toHaveBeenCalledWith(authorizedRequest.userId);
    expect(result).toEqual(groupModels);
  });

  it('should create a new group and return it', async () => {
    const group = {
      title: "NewGroup"
    }
    const result = await sut.create(group, authorizedRequest);
    expect(groupsServiceMock.create).toHaveBeenCalledWith(authorizedRequest.userId, group);
    expect(result).toEqual(groupModels[0]);
  });

  it('should add new purposes to the group', async () =>{
    const purposeIds = [1, 3];
    const result = await sut.addPurposes(1, {purposeIds});

    expect(result).toEqual(groupModels[0]);
    expect(groupsServiceMock.addPurposes).toHaveBeenCalledWith(1, {purposeIds});
  });

  it('should update a group', async () =>{
    const groupId = 1;
    const updateGroupDto = {title: 'New Title'};
    const result = await sut.update(groupId, updateGroupDto);

    expect(result).toEqual(groupModels[0]);
    expect(groupsServiceMock.update).toHaveBeenCalledWith(groupId, updateGroupDto);
  });

  it('should add user to the group by joinCode', async () => {
    const joinGroupDto = {joinCode: 'SomeCode'};
    const result = await sut.joinGroup(joinGroupDto, authorizedRequest);

    expect(result).toEqual(groupModels[0]);
    expect(groupsServiceMock.joinGroup).toHaveBeenCalledWith(joinGroupDto.joinCode, authorizedRequest.userId);
  });

  it('should delete group by id', async () => {
    const groupId = 1
    await sut.remove(groupId, res as any);

    expect(groupsServiceMock.remove).toHaveBeenCalledWith(groupId);
  });

  it('should remove a user from a group', async () => {
    const groupId = 1;
    const memberId = 5;
    await sut.removeUserFromGroup(groupId, memberId, res as any);

    expect(groupsServiceMock.removeUserFromGroup).toHaveBeenCalledWith(groupId, memberId);
  });

  it('should remove purposes from group', async () => {
    const groupId = 1;
    const purposeId = 2;
    await sut.removePurposesFromGroup(groupId, purposeId, res as any);

    expect(groupsServiceMock.removePurposeFromGroup).toHaveBeenCalledWith(groupId, purposeId);
  });
})