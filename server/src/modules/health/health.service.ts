import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as ccxt from 'ccxt';

type HEALTH_STATE = 'alive' | 'dead';

@Injectable()
export class HealthService {
  private exchanges = new Map<string, ccxt.Exchange>();
  private readonly logger = new Logger(HealthService.name);

  constructor() {
    // Enable this with api keys in .env
    // this.checkApiKeys()
    this.initializeExchange();
  }

  private initializeExchange() {
    // Initialize exchanges
    this.exchanges.set(
      'bitfinex',
      new ccxt.bitfinex({
        apiKey: process.env.BITFINEX_API_KEY,
        secret: process.env.BITFINEX_SECRET,
      }),
    );
    this.exchanges.set(
      'mexc',
      new ccxt.mexc({
        apiKey: process.env.MEXC_API_KEY,
        secret: process.env.MEXC_SECRET,
      }),
    );
    this.exchanges.set(
      'binance',
      new ccxt.binance({
        apiKey: process.env.BINANCE_API_KEY,
        secret: process.env.BINANCE_SECRET,
      }),
    );
  }

  private checkApiKeys() {
    if (!process.env.BITFINEX_API_KEY || !process.env.BITFINEX_SECRET) {
      throw new InternalServerErrorException(
        `Bitfinex API key or Secret is invalid`,
      );
    }
    if (!process.env.MEXC_API_KEY || !process.env.MEXC_SECRET) {
      throw new InternalServerErrorException(
        `MEXC API key or Secret is invalid`,
      );
    }
    if (!process.env.BINANCE_API_KEY || !process.env.BINANCE_SECRET) {
      throw new InternalServerErrorException(
        `Binance API key or Secret is invalid`,
      );
    }
  }

  async ping(): Promise<string> {
    return 'pong';
  }

  async getAllHealth(): Promise<any> {
    const healthMap = new Map<string, string>();
    const allExchanges = Array.from(this.exchanges.values());
    // Get balance from each exchange to test if API key is valid
    const allRequests = [];
    for (let i = 0; i < allExchanges.length; i++) {
      try {
        allRequests.push(allExchanges[i].fetchBalance());
      } catch (e) {
        healthMap.set(allExchanges[i].name, 'dead');
        this.logger.error(`Exchange ${allExchanges[i].name} is dead`);
      }
    }

    const responses = await Promise.all(allRequests);
    for (let i = 0; i < responses.length; i++) {
      if (!responses[i].balance) {
        healthMap.set(allExchanges[i].name, 'dead');
        this.logger.error(`Exchange ${allExchanges[i].name} is dead`);
      }
      healthMap.set(allExchanges[i].name, 'alive');
    }

    const result = Object.entries(healthMap);
    if (result.length === 0) {
      throw new InternalServerErrorException(`Exchanges are all dead`);
    }
    return result;
  }

  async getExchangeHealth(exchangeName: string): Promise<any> {
    const exchange = this.exchanges.get(exchangeName);
    if (!exchange) {
      throw new BadRequestException(
        'Exchange not found, use GET /strategy/supported-exchanges to get supported exchanges',
      );
    }
    const balance = await exchange.fetchBalance();
    if (!balance) {
      throw new InternalServerErrorException(
        `Exchange ${exchange.name} is dead`,
      );
    }
    return { statusCode: 200, message: 'alive' };
  }
}
