import { createCurrencyEntities } from '../../fixtures/currency.fixtures';

const currencyEntities = createCurrencyEntities();

export const currencyServiceMock = {
  getAllCurrencies: jest.fn().mockImplementation(async () => {
    return Promise.resolve(currencyEntities);
  }),
  getCurrencyEntity: jest.fn().mockImplementation(async () => {
    return Promise.resolve(currencyEntities[0]);
  }),
  getExchangeRateToUSD: jest.fn().mockResolvedValue(1.5),
};
