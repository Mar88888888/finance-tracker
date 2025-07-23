import { GroupEntity } from '../../src/groups/group.entity';
import { GroupModel } from '../../src/groups/group.model';
import { UserEntity } from '../../src/users/user.entity';
import { UserModel } from '../../src/users/user.model';

const testParams = {
  id: 1,
  title: 'Group Title',
  owner: { id: 2 } as any,
  joinCode: 'Code',
};

describe('Group Model', () => {
  let sut: GroupModel;

  beforeEach(() => {
    sut = new GroupModel(testParams);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should set and get group Id', () => {
    const groupId = 2;
    const result = sut.id;
    expect(result).toBe(testParams.id);

    sut.setId(groupId);
    expect(sut.id).toBe(groupId);
  });

  it('should set and get group title', () => {
    const groupTitle = 'New Title';
    const result = sut.title;
    expect(result).toBe(testParams.title);

    sut.setTitle(groupTitle);
    expect(sut.title).toBe(groupTitle);
  });

  it('should set and get group members', () => {
    const groupMembers: UserModel[] = [{ id: 2 } as any, { id: 3 } as any];
    const result = sut.members;
    expect(result).toEqual([]);

    sut.setMembers(groupMembers);
    expect(sut.members).toEqual(groupMembers);
  });

  it('should set and get group owner', () => {
    const groupOwner: UserModel = { id: 3 } as any;
    const result = sut.owner;
    expect(result).toEqual(testParams.owner);

    sut.setOwner(groupOwner);
    expect(sut.owner).toEqual(groupOwner);
  });

  it('should set and get group purposes', () => {
    const groupPurposes = [2, 3];
    const result = sut.purposes;
    expect(result).toEqual([]);

    sut.addPurposes(groupPurposes);
    expect(sut.purposes).toEqual(groupPurposes);
  });

  it('should set and get group code', () => {
    const groupCode = 'New Code';
    const result = sut.joinCode;
    expect(result).toBe(testParams.joinCode);

    sut.setJoinCode(groupCode);
    expect(sut.joinCode).toBe(groupCode);
  });

  it('should fallback to empty arrays if purposes and members are undefined', () => {
    const mockOwner = new UserEntity();
    mockOwner.id = 1;
    mockOwner.email = 'owner@example.com';

    const mockEntity = new GroupEntity();
    mockEntity.id = 1;
    mockEntity.title = 'Test Group';
    mockEntity.owner = mockOwner;
    mockEntity.joinCode = 'ABC123';
    mockEntity.purposes = undefined;
    mockEntity.members = undefined;

    const result = GroupModel.fromEntity(mockEntity);

    expect(result.purposes).toEqual([]);
    expect(result.members).toEqual([]);
  });
});
