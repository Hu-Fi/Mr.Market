// exchange.service.ts
import * as ccxt from 'ccxt';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExchangeRepository } from 'src/modules/mixin/exchange/exchange.repository';

@Injectable()
export class ExchangeService {
  private exchangeInstances: { [key: string]: ccxt.Exchange } = {};

  constructor(
    @InjectRepository(ExchangeRepository)
    private exchangeRepository: ExchangeRepository,
  ) {}

  async onModuleInit() {
    await this.loadAPIKeys();
  }

  private async loadAPIKeys() {
    const apiKeys = await this.exchangeRepository.readAllAPIKeys();

    for (const key of apiKeys) {
      const exchange = key.exchangeIndex;
      const apiKey = key.api_key;
      const apiSecret = key.api_secret;

      if (!this.exchangeInstances[exchange]) {
        this.exchangeInstances[exchange] = new ccxt[exchange]({
          apiKey,
          secret: apiSecret,
        });
      }
    }
  }

  private async pickAPIKeyOnDemand(
    exchange: string,
    asset_id: string,
    amount: string,
  ) {
    const apiKeys = this.exchangeRepository.readAllAPIKeysByExchange(exchange);
    console.log(asset_id, amount, apiKeys);
    // Map asset_id to symbol, Get balance, compare with amount
    // if balance is larger, return API key
    // if balance is smaller, loop API keys and compare
    // if no API key have balance, trigger rebalance or return failed
  }
}
