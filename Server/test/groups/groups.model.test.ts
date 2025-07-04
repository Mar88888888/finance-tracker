import { GroupModel } from "../../src/groups/group.model"
import { UserModel } from "../../src/users/user.model";

const testParams = {
  id: 1,
  title: 'Group Title',
  owner: {id: 2} as any,
  joinCode: 'Code',
}

describe('Group Model', () =>{
  let sut: GroupModel;

  beforeEach(()=>{
    sut = new GroupModel(testParams);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should set and get group Id', () => {
    const groupId = 2;
    const result = sut.getId();
    expect(result).toBe(testParams.id);

    sut.setId(groupId);
    expect(sut.getId()).toBe(groupId);
  });

  it('should set and get group title', () => {
    const groupTitle = 'New Title';
    const result = sut.getTitle();
    expect(result).toBe(testParams.title);

    sut.setTitle(groupTitle);
    expect(sut.getTitle()).toBe(groupTitle);
  });

  it('should set and get group members', () => {
    const groupMembers: UserModel[] = [{id: 2} as any, {id: 3} as any,];
    const result = sut.getMembers();
    expect(result).toEqual([]);

    sut.setMembers(groupMembers);
    expect(sut.getMembers()).toEqual(groupMembers);
  });

  it('should set and get group owner', () => {
    const groupOwner: UserModel = {id: 3} as any;
    const result = sut.getOwner();
    expect(result).toEqual(testParams.owner);

    sut.setOwner(groupOwner);
    expect(sut.getOwner()).toEqual(groupOwner);
  });

  it('should set and get group purposes', () => {
    const groupPurposes = [2, 3];
    const result = sut.getPurposes();
    expect(result).toEqual([]);

    sut.addPurposes(groupPurposes);
    expect(sut.getPurposes()).toEqual(groupPurposes);
  });

  it('should set and get group code', () => {
    const groupCode = 'New Code';
    const result = sut.getJoinCode();
    expect(result).toBe(testParams.joinCode);

    sut.setJoinCode(groupCode);
    expect(sut.getJoinCode()).toBe(groupCode);
  });
})