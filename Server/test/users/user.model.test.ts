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

    expect(model.id).toBe(1);
    expect(model.name).toBe('John Doe');
    expect(model.email).toBe('john@example.com');
    expect(model.password).toBe('hashed.password');
    expect(model.age).toBe(30);
    expect(model.gender).toBe(true);
    expect(model.transactions).toEqual([]);
    expect(model.ownedGroups).toEqual([]);
    expect(model.groups).toEqual([]);
    expect(model.purposes).toEqual([]);
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

    expect(model.id).toBe(2);
    expect(model.name).toBe('Jane Doe');
    expect(model.email).toBe('jane@example.com');
    expect(model.password).toBe('newpass');
    expect(model.age).toBe(25);
    expect(model.gender).toBe(false);
    expect(model.transactions).toEqual(mockTransactions);
    expect(model.ownedGroups).toEqual(mockGroups);
    expect(model.groups).toEqual(mockGroups);
    expect(model.purposes).toEqual(mockPurposes);
  });

  it('should convert from UserEntity to UserModel', () => {
    const entity = new UserEntity();
    Object.assign(entity, baseParams);

    const model = UserModel.fromEntity(entity);
    expect(model).toBeInstanceOf(UserModel);
    expect(model.email).toBe(baseParams.email);
  });

  it('should convert from UserModel to UserEntity', () => {
    const model = new UserModel(baseParams);
    const entity = UserModel.toEntity(model);

    expect(entity).toBeInstanceOf(UserEntity);
    expect(entity.name).toBe(baseParams.name);
    expect(entity.email).toBe(baseParams.email);
  });
});
