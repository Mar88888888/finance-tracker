import { TransactionsModule } from '../../src/transactions/transactions.module';

describe('Transactions Module', () => {
  let sut: TransactionsModule;

  beforeEach(() => {
    sut = new TransactionsModule();
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });
});
