import { UserModel, UserModelParams } from '../../src/users/user.model';
import { UserEntity } from '../../src/users/user.entity';

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
