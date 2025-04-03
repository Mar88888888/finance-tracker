import { UserModel } from '../users/user.model';
import { PurposeEntity } from '../purposes/purpose.entity';
import { GroupModel, GroupModelParams } from '../groups/group.model';
import { GroupEntity } from '../groups/group.entity';

describe('GroupModel', () => {
  let params: GroupModelParams;
  let model: GroupModel;
  let owner: UserModel;
  let member1: UserModel;
  let member2: UserModel;

  beforeEach(() => {
    owner = new UserModel({ id: 1, name: 'Owner', email: 'owner@example.com', password: 'password', age: 30, gender: true });
    member1 = new UserModel({ id: 2, name: 'Member 1', email: 'member1@example.com', password: 'password', age: 25, gender: false });
    member2 = new UserModel({ id: 3, name: 'Member 2', email: 'member2@example.com', password: 'password', age: 28, gender: true });

    params = {
      id: 1,
      title: 'Test Group',
      owner: owner,
      joinCode: 'JOINCODE',
      mindate: new Date('2023-01-01'),
      maxdate: new Date('2023-12-31'),
      purposes: [1, 2],
      members: [member1, member2],
    };
    model = new GroupModel(params);
  });

  it('should create an instance', () => {
    expect(model).toBeDefined();
  });

  it('should get and set id', () => {
    expect(model.getId()).toBe(1);
    model.setId(2);
    expect(model.getId()).toBe(2);
  });

  it('should get and set title', () => {
    expect(model.getTitle()).toBe('Test Group');
    model.setTitle('New Title');
    expect(model.getTitle()).toBe('New Title');
  });

  it('should get and set owner', () => {
    expect(model.getOwner()).toEqual(owner);
    const newOwner = new UserModel({ id: 4, name: 'New Owner', email: 'newowner@example.com', password: 'password', age: 35, gender: false });
    model.setOwner(newOwner);
    expect(model.getOwner()).toEqual(newOwner);
  });

  it('should get and set members', () => {
    expect(model.getMembers()).toEqual([member1, member2]);
    const newMembers = [new UserModel({ id: 4, name: 'New Member', email: 'newmember@example.com', password: 'password', age: 40, gender: true })];
    model.setMembers(newMembers);
    expect(model.getMembers()).toEqual(newMembers);
  });

  it('should get and set joinCode', () => {
    expect(model.getJoinCode()).toBe('JOINCODE');
    model.setJoinCode('NEWCODE');
    expect(model.getJoinCode()).toBe('NEWCODE');
  });

  it('should add member', () => {
    const newMember = new UserModel({ id: 4, name: 'New Member', email: 'newmember@example.com', password: 'password', age: 40, gender: true });
    model.addMember(newMember);
    expect(model.getMembers()).toContain(newMember);
  });

  it('should remove member', () => {
    model.removeMember(member1);
    expect(model.getMembers()).not.toContain(member1);
  });

  it('should get and set mindate', () => {
    const newMindate = new Date('2024-01-01');
    model.setMindate(newMindate);
    expect(model.getMindate()).toEqual(newMindate);
  });

  it('should get and set maxdate', () => {
    const newMaxdate = new Date('2024-12-31');
    model.setMaxdate(newMaxdate);
    expect(model.getMaxdate()).toEqual(newMaxdate);
  });

  it('should get and set purposes', () => {
    expect(model.getPurposes()).toEqual([1, 2]);
    model.setPurposes([3, 4]);
    expect(model.getPurposes()).toEqual([3, 4]);
  });

  it('should add purposes', () => {
    model.addPurposes([3, 4, 1]);
    expect(model.getPurposes()).toEqual([1, 2, 3, 4]);
  });

  it('should remove purpose', () => {
    model.removePurpose(1);
    expect(model.getPurposes()).toEqual([2]);
  });

  it('should convert from entity', () => {
    const entity = new GroupEntity();
    entity.id = 1;
    entity.title = 'Test Group';
    entity.owner = UserModel.toEntity(owner);
    entity.joinCode = 'JOINCODE';
    entity.mindate = new Date('2023-01-01');
    entity.maxdate = new Date('2023-12-31');
    entity.purposes = [1, 2].map(purposeId => {
      const purposeEntity = new PurposeEntity();
      purposeEntity.id = purposeId;
      return purposeEntity;
    });
    entity.members = [member1, member2].map(user => UserModel.toEntity(user));

    const convertedModel = GroupModel.fromEntity(entity);
    expect(convertedModel).toEqual(model);
  });

  it('should convert to entity', () => {
    const entity = GroupModel.toEntity(model);
    expect(entity.id).toBe(1);
    expect(entity.title).toBe('Test Group');
    expect(UserModel.fromEntity(entity.owner)).toEqual(owner);
    expect(entity.joinCode).toBe('JOINCODE');
    expect(entity.mindate).toEqual(new Date('2023-01-01'));
    expect(entity.maxdate).toEqual(new Date('2023-12-31'));
    expect(entity.purposes.map(p => p.id)).toEqual([1, 2]);
    expect(entity.members.map(m => UserModel.fromEntity(m))).toEqual([member1, member2]);
  });
});