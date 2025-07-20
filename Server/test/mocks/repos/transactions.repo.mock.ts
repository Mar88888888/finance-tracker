import { TransactionEntity } from '../../../src/transactions/transaction.entity';
import { RepoMock } from './repo.mock.interface';

export const mockQb = {
  innerJoinAndSelect: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  getMany: jest.fn(),
};

export function createTransactionRepoMock(
  transactionEntities: TransactionEntity[],
): RepoMock<TransactionEntity> {
  return {
    createQueryBuilder: jest.fn().mockReturnValue(mockQb),
    findOne: jest.fn().mockResolvedValue(transactionEntities[0]),
    find: jest.fn().mockResolvedValue(transactionEntities),
    create: jest.fn().mockReturnValue(transactionEntities[0]),
    save: jest
      .fn()
      .mockImplementation(async (entity: TransactionEntity) =>
        Promise.resolve(entity),
      ),
    delete: jest.fn(),
  };
}
