import { CurrencyModule } from "../../src/currency/currency.module"

describe('Currency module', () => {
  let sut: CurrencyModule;
  beforeEach(() => {
      sut = new CurrencyModule()
    });
  it('should be defined', ()=> {
    expect(sut).toBeDefined();
  })
});