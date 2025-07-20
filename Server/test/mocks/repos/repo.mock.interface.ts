export interface RepoMock<T> {
  findOne: jest.Mock<Promise<T | undefined>, any[]>;
  find: jest.Mock<Promise<T[]>, any[]>;
  create: jest.Mock<T, any[]>;
  save: jest.Mock<Promise<T>, [T]>;
  delete: jest.Mock<any, any[]>;
  createQueryBuilder?: jest.Mock<any, any[]>;
}
