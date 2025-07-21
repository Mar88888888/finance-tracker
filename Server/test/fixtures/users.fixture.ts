import { UserEntity } from '../../src/users/user.entity';
import { UserModel } from '../../src/users/user.model';

export function createUserModels(): UserModel[] {
  return [
    new UserModel({
      id: 10,
      name: 'SomeName',
      age: 14,
      email: 'email@em.com',
      gender: false,
      password: 'hashed.password1',
    }),
    new UserModel({
      id: 5,
      name: 'SomeName2',
      age: 19,
      email: 'email2@em.com',
      gender: true,
      password: 'hashed.password2',
    }),
  ];
}

export function createUserEntities(userModels: UserModel[]): UserEntity[] {
  return userModels.map(UserModel.toEntity);
}
