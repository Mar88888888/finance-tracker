import { CurrencyCode } from "../../src/currency/currency-code.enum";
import { CurrencyController } from "../../src/currency/currency.controller";
import { CurrencyEntity } from "../../src/currency/currency.entity";

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

const currencyService = {
  getAllCurrencies: jest.fn().mockImplementation(async () => {
    return Promise.resolve([someCurrencyEntity, someCurrencyEntity2]);
  })
}

describe('Currency Controller', ()=>{
  let sut: CurrencyController;
  beforeEach(()=>{
    sut = new CurrencyController(
      currencyService as any
    )
  })

  it('should be defined', ()=> {
    expect(sut).toBeDefined();
  })

  it('should retrieve currencies from service', async ()=>{
    let result = await sut.getAllCurrencies();
    expect(currencyService.getAllCurrencies).toHaveBeenCalledTimes(1);
    expect(result).toEqual([someCurrencyEntity, someCurrencyEntity2]);
  })
});