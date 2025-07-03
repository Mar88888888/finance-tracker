import { CurrencyCode } from '../../src/currency/currency-code.enum';
import { CurrencyEntity } from '../../src/currency/currency.entity';
import { CurrencyService } from '../../src/currency/currency.service';
import axios from 'axios';
import { cahceManagerMock } from '../mocks/cache-manager.mock';

const someCurrencyEntity: CurrencyEntity = {
  code: CurrencyCode.EUR,
  name: 'Euro',
  transactions: [],
};

const someCurrencyEntity2: CurrencyEntity = {
  code: CurrencyCode.USD,
  name: 'US Dollar',
  transactions: [],
};

const CurrencyRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
}



jest.mock('axios');

describe('Currency Service', () => {
  let sut: CurrencyService;
  beforeEach(() => {
    sut = new CurrencyService(
      CurrencyRepository as any,
      cahceManagerMock as any,
    );
    jest.spyOn(CurrencyRepository, 'find').mockResolvedValue([someCurrencyEntity, someCurrencyEntity2]);
    jest.spyOn(CurrencyRepository, 'findOne').mockImplementation(({ where }) => {
      if (where.code === CurrencyCode.EUR) {
        return Promise.resolve(someCurrencyEntity);
      } else if (where.code === CurrencyCode.USD) {
        return Promise.resolve(someCurrencyEntity2);
      }
      return Promise.resolve(null);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return all currencies', async () => {
    const result = await sut.getAllCurrencies();
    expect(result).toEqual([someCurrencyEntity, someCurrencyEntity2]);
    expect(CurrencyRepository.find).toHaveBeenCalledTimes(1);
  });

  it('should return empty array if no currencies found', async () => {
    jest.spyOn(CurrencyRepository, 'find').mockResolvedValue([]);
    const result = await sut.getAllCurrencies();
    expect(result).toEqual([]);
    expect(CurrencyRepository.find).toHaveBeenCalledTimes(1);
  });

  it('should return 1 if USD currency code provided', async () => {
    const currencyCode = CurrencyCode.USD;
    const result = await sut.getExchangeRateToUSD(currencyCode, '2023-10-01');
    expect(result).toBe(1);
  });

  it('should return exchange rate from cache if available', async () => {
    const currencyCode = CurrencyCode.EUR;
    const cachedRate = 1.1;
    jest.spyOn(cahceManagerMock, 'get').mockResolvedValueOnce(cachedRate);
    const result = await sut.getExchangeRateToUSD(currencyCode, '2023-10-01');
    expect(result).toBe(cachedRate);
    expect(cahceManagerMock.get).toHaveBeenCalledWith('exchange-rate:EUR->USD@2023-10-01');
  });

  it('should fetch exchange rate from API if not in cache', async () => {
    const currencyCode = CurrencyCode.EUR;
    const currencyDate = '2023-10-01';
    const USDRate = 1.1;
    jest.spyOn(axios, 'get').mockResolvedValue({
      data: { rates: { USD: USDRate } },
    });
    const result = await sut.getExchangeRateToUSD(currencyCode, currencyDate);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(result).toBe(USDRate);
    expect(cahceManagerMock.set).toHaveBeenCalledTimes(1);
    expect(cahceManagerMock.set).toHaveBeenCalledWith(
      sut.getExchangeRateCacheKey(currencyCode, currencyDate), USDRate, 86400
    );
  });

  it('should throw an error if fetching wasn\'t successful', async () => {
    const currencyCode = CurrencyCode.EUR;
    const currencyDate = '2023-10-01';
    const currencyError = new Error(`Error message`);
    jest.spyOn(axios, 'get').mockRejectedValueOnce(currencyError);
    sut
      .getExchangeRateToUSD(currencyCode, currencyDate)
      .catch(error => {
        expect(error.message).toMatch(`Failed to fetch exchange rate for ${currencyCode} on ${currencyDate}: ${currencyError.message}`)
      })
  })

  it('should return currency entity if valid currency code provided', async () => {
    const currencyCode = CurrencyCode.EUR; 
    const result = await sut.getCurrencyEntity(currencyCode);
    expect(result).toEqual(someCurrencyEntity);
    expect(CurrencyRepository.findOne).toHaveBeenCalledTimes(1);
    expect(CurrencyRepository.findOne).toHaveBeenCalledWith({
      where: { code: currencyCode },
    });
  });

  it('should return null if invalid currency code provided', async () => {
    const currencyCode = 'INVALID_CODE' as CurrencyCode;
    const result = await sut.getCurrencyEntity(currencyCode);
    expect(result).toBeNull();
    expect(CurrencyRepository.findOne).toHaveBeenCalledTimes(1);
  });
});