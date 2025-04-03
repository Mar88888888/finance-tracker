import { UserEntity } from '../users/user.entity';
import { UserModel, UserModelParams } from '../users/user.model';

describe('UserModel', () => {
  let params: UserModelParams;
  let model: UserModel;

  beforeEach(() => {
    params = {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password',
      age: 30,
      gender: true,
      verificationToken: 'token',
      transactions: [],
      myGroups: [],
      groups: [],
      purposes: [],
    };
    model = new UserModel(params);
  });

  it('should create an instance', () => {
    expect(model).toBeDefined();
  });

  it('should get and set id', () => {
    expect(model.getId()).toBe(1);
    model.setId(2);
    expect(model.getId()).toBe(2);
  });

  it('should get and set name', () => {
    expect(model.getName()).toBe('John Doe');
    model.setName('Jane Doe');
    expect(model.getName()).toBe('Jane Doe');
  });

  it('should get and set email', () => {
    expect(model.getEmail()).toBe('john.doe@example.com');
    model.setEmail('jane.doe@example.com');
    expect(model.getEmail()).toBe('jane.doe@example.com');
  });

  it('should get and set password', () => {
    expect(model.getPassword()).toBe('password');
    model.setPassword('newPassword');
    expect(model.getPassword()).toBe('newPassword');
  });

  it('should get and set age', () => {
    expect(model.getAge()).toBe(30);
    model.setAge(35);
    expect(model.getAge()).toBe(35);
  });

  it('should get and set gender', () => {
    expect(model.getGender()).toBe(true);
    model.setGender(false);
    expect(model.getGender()).toBe(false);
  });

  it('should get and set transactions', () => {
    const transactions = [{ id: 1 }, { id: 2 }] as any;
    model.setTransactions(transactions);
    expect(model.getTransactions()).toEqual(transactions);
  });

  it('should get and set myGroups', () => {
    const myGroups = [{ id: 1 }, { id: 2 }] as any;
    model.setMyGroups(myGroups);
    expect(model.getMyGroups()).toEqual(myGroups);
  });

  it('should get and set groups', () => {
    const groups = [{ id: 1 }, { id: 2 }] as any;
    model.setGroups(groups);
    expect(model.getGroups()).toEqual(groups);
  });

  it('should get and set purposes', () => {
    const purposes = [{ id: 1 }, { id: 2 }] as any;
    model.setPurposes(purposes);
    expect(model.getPurposes()).toEqual(purposes);
  });

  it('should convert from entity', () => {
    const entity = new UserEntity();
    entity.id = 1;
    entity.name = 'John Doe';
    entity.email = 'john.doe@example.com';
    entity.password = 'password';
    entity.age = 30;
    entity.gender = true;
    entity.verificationToken = 'token';
    entity.transactions = [];
    entity.myGroups = [];
    entity.groups = [];
    entity.purposes = [];

    const convertedModel = UserModel.fromEntity(entity);
    expect(convertedModel).toEqual(model);
  });

  it('should convert to entity', () => {
    const entity = UserModel.toEntity(model);
    expect(entity.id).toBe(1);
    expect(entity.name).toBe('John Doe');
    expect(entity.email).toBe('john.doe@example.com');
    expect(entity.password).toBe('password');
    expect(entity.age).toBe(30);
    expect(entity.gender).toBe(true);
    expect(entity.transactions).toEqual([]);
    expect(entity.myGroups).toEqual([]);
    expect(entity.groups).toEqual([]);
    expect(entity.purposes).toEqual([]);
  });
});