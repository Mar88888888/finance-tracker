import { UserModel } from "../../src/users/user.model";

export const members = [
  new UserModel({
    id: 10,
    name: 'SomeName',
    age:14,
    email: 'email@em.com',
    gender: false,
    password: 'password1',
  }),
  new UserModel({
    id: 5,
    name: 'SomeName2',
    age:19,
    email: 'email2@em.com',
    gender: true,
    password: 'password2',
  }),
];
