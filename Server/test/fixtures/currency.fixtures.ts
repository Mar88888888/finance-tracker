import { CurrencyCode } from '../../src/currency/currency-code.enum';
import { CurrencyEntity } from '../../src/currency/currency.entity';

export function createCurrencyEntities(): CurrencyEntity[] {
  return [
    {
      code: CurrencyCode.EUR,
      name: 'Euro',
      transactions: [],
    },
    {
      code: CurrencyCode.USD,
      name: 'US Dollar',
      transactions: [],
    },
  ];
}
