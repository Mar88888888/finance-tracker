import { CurrencyCode } from '../../src/currency/currency-code.enum';
import { CurrencyController } from '../../src/currency/currency.controller';
import { CurrencyEntity } from '../../src/currency/currency.entity';
import { createCurrencyEntities } from '../fixtures/currency.fixtures';
import { currencyServiceMock } from '../mocks/services/currency.service.mock';

describe('Currency Controller', () => {
  let sut: CurrencyController;
  let currencyEntities: CurrencyEntity[];

  beforeEach(() => {
    currencyEntities = createCurrencyEntities();
    sut = new CurrencyController(currencyServiceMock as any);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should retrieve currencies from service', async () => {
    let result = await sut.getAllCurrencies();
    expect(currencyServiceMock.getAllCurrencies).toHaveBeenCalledTimes(1);
    expect(result).toEqual(currencyEntities);
  });
});
