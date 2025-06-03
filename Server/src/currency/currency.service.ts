import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CurrencyCode } from './currency-code.enum';
import { Repository } from 'typeorm';
import { CurrencyEntity } from './currency.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CurrencyService {
  constructor(
    @InjectRepository(CurrencyEntity)
    private readonly currencyRepository: Repository<CurrencyEntity>,
  ) {}


  async getExchangeRateToUSD(fromCurrency: CurrencyCode, date: string): Promise<number> {
    if (fromCurrency === 'USD') return 1;

    const url = `https://api.frankfurter.dev/${date}?from=${fromCurrency}&to=USD`;

    try {
      const response = await axios.get(url);
      return response.data.rates['USD'];
    } catch (error) {
      throw new Error(`Failed to fetch exchange rate for ${fromCurrency} on ${date}`);
    }
  }

  async getCurrencyEntity(currency: CurrencyCode): Promise<CurrencyEntity> {
    const existingCurrency = await this.currencyRepository.findOne({
      where: { code: currency },
    });
    return existingCurrency;
  }
}
