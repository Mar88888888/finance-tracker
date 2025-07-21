import { UserModel, UserModelParams } from '../../src/users/user.model';
import { UserEntity } from '../../src/users/user.entity';
import {
  createTransactionEntities,
  createTransactionModels,
} from '../fixtures/transactions.fixtures';
import {
  createGroupEntities,
  createGroupModels,
} from '../fixtures/groups.fixtures';
import {
  createPurposeEntities,
  createPurposeModels,
} from '../fixtures/purposes.fixtures';

describe('UserModel', () => {
  const baseParams: UserModelParams = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashed.password',
    age: 30,
    gender: true,
  };

  it('should initialize with params', () => {
    const model = new UserModel(baseParams);

    expect(model.getId()).toBe(1);
    expect(model.getName()).toBe('John Doe');
    expect(model.getEmail()).toBe('john@example.com');
    expect(model.getPassword()).toBe('hashed.password');
    expect(model.getAge()).toBe(30);
    expect(model.getGender()).toBe(true);
    expect(model.getTransactions()).toEqual([]);
    expect(model.getOwnedGroups()).toEqual([]);
    expect(model.getGroups()).toEqual([]);
    expect(model.getPurposes()).toEqual([]);
  });

  it('should allow setting properties', () => {
    const model = new UserModel(baseParams);

    const mockTransactionModels = createTransactionModels();
    const mockGroupModels = createGroupModels();
    const mockPurposeModels = createPurposeModels();

    const mockTransactions = createTransactionEntities(mockTransactionModels);
    const mockGroups = createGroupEntities(mockGroupModels);
    const mockPurposes = createPurposeEntities(mockPurposeModels);

    model.setId(2);
    model.setName('Jane Doe');
    model.setEmail('jane@example.com');
    model.setPassword('newpass');
    model.setAge(25);
    model.setGender(false);
    model.setTransactions(mockTransactions);
    model.setOwnedGroups(mockGroups);
    model.setGroups(mockGroups);
    model.setPurposes(mockPurposes);

    expect(model.getId()).toBe(2);
    expect(model.getName()).toBe('Jane Doe');
    expect(model.getEmail()).toBe('jane@example.com');
    expect(model.getPassword()).toBe('newpass');
    expect(model.getAge()).toBe(25);
    expect(model.getGender()).toBe(false);
    expect(model.getTransactions()).toEqual(mockTransactions);
    expect(model.getOwnedGroups()).toEqual(mockGroups);
    expect(model.getGroups()).toEqual(mockGroups);
    expect(model.getPurposes()).toEqual(mockPurposes);
  });

  it('should convert from UserEntity to UserModel', () => {
    const entity = new UserEntity();
    Object.assign(entity, baseParams);

    const model = UserModel.fromEntity(entity);
    expect(model).toBeInstanceOf(UserModel);
    expect(model.getEmail()).toBe(baseParams.email);
  });

  it('should convert from UserModel to UserEntity', () => {
    const model = new UserModel(baseParams);
    const entity = UserModel.toEntity(model);

    expect(entity).toBeInstanceOf(UserEntity);
    expect(entity.name).toBe(baseParams.name);
    expect(entity.email).toBe(baseParams.email);
  });
});
