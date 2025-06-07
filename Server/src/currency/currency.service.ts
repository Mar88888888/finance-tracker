import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { CurrencyCode } from './currency-code.enum';
import { Repository } from 'typeorm';
import { CurrencyEntity } from './currency.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';


@Injectable()
export class CurrencyService {
  constructor(
    @InjectRepository(CurrencyEntity)
    private readonly currencyRepository: Repository<CurrencyEntity>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async getAllCurrencies(): Promise<CurrencyEntity[]> {
    return this.currencyRepository.find();
  }

   private getExchangeRateCacheKey(fromCurrency: string, date: string): string {
    return `exchange-rate:${fromCurrency}->USD@${date}`;
  }

  async getExchangeRateToUSD(fromCurrency: string, date: string): Promise<number> {
    if (fromCurrency === 'USD') return 1;

    const cacheKey = this.getExchangeRateCacheKey(fromCurrency, date);
    const cachedRate = await this.cacheManager.get<number>(cacheKey);
    if (cachedRate !== null) {
      return cachedRate;
    }

    const url = `https://api.frankfurter.dev/v1/${date}?from=${fromCurrency}&to=USD`;

    try {
      const response = await axios.get(url);
      const rate = response.data.rates['USD'];

      await this.cacheManager.set(cacheKey, rate, 86400);

      return rate;
    } catch (error) {
      throw new Error(`Failed to fetch exchange rate for ${fromCurrency} on ${date}: ${(error as Error).message}`);
    }
  }
  
  async getCurrencyEntity(currency: CurrencyCode): Promise<CurrencyEntity> {
    const existingCurrency = await this.currencyRepository.findOne({
      where: { code: currency },
    });
    return existingCurrency;
  }
}
