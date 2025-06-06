import { Controller, Get, Post } from '@nestjs/common';
import { CurrencyService } from './currency.service';

@Controller('currencies')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}
  @Get()
  async getAllCurrencies() {
    return this.currencyService.getAllCurrencies();
  }
}
