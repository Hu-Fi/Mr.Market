/**
 * HealthService
 *
 * This service manages the health checks for various components of the application,
 * including database tables and cryptocurrency exchanges using the CCXT library.
 * It provides methods to check the overall health status, individual exchange health,
 * and database table health.
 *
 * Dependencies:
 * - EntityManager: TypeORM's EntityManager for database operations.
 * - CustomLogger: Custom logging service for recording errors and log information.
 * - ccxt: Cryptocurrency exchange trading library.
 *
 * Methods:
 * - constructor: Initializes the service with the injected EntityManager and sets up exchanges.
 * - initializeExchange(): Initializes the cryptocurrency exchanges with API keys and secrets.
 * - checkApiKeys(): Validates the presence of required API keys and secrets in environment variables.
 * - ping(): Returns a simple 'pong' response to verify service availability.
 * - checkDbHealth(): Checks the health of various database tables by counting the number of records.
 * - getAllHealth(): Checks the health of all configured exchanges by fetching their balances.
 * - getExchangeHealth(exchangeName: string): Checks the health of a specific exchange by name.
 *
 * Error Handling:
 * - Throws InternalServerErrorException for missing or invalid API keys.
 * - Throws BadRequestException if the requested exchange is not found.
 * - Logs errors and health statuses using the CustomLogger.
 *
 * Notes:
 * - The service uses caching to manage API rate limits and improve performance.
 * - Health statuses are stored in a Map and returned as an array of objects.
 * - If all exchanges are found to be 'dead', an InternalServerErrorException is thrown.
 */

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as ccxt from 'ccxt';
import { CustomLogger } from '../logger/logger.service';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

type HEALTH_STATE = 'alive' | 'dead';

@Injectable()
export class HealthService {
  private exchanges = new Map<string, ccxt.Exchange>();
  private readonly logger = new CustomLogger(HealthService.name);

  constructor(@InjectEntityManager() private entityManager: EntityManager) {
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

  async checkDbHealth(): Promise<any> {
    const tables = [
      'Trade',
      'Performance',
      'Transaction',
      'UserBalance',
      'Snapshot',
      'SpotOrder',
      'exchangeAPIKeysConfig',
      'CustomConfigEntity',
      'MixinReleaseToken',
      'MixinReleaseHistory',
      'MixinMessage',
      'MixinUser',
    ];
    const healthStatus = {};

    for (const table of tables) {
      try {
        const count = await this.entityManager.query(
          `SELECT COUNT(*) FROM "${table}"`,
        );
        healthStatus[table] = { status: 'OK', count: count[0].count };
      } catch (error) {
        healthStatus[table] = { status: 'ERROR', error: error.message };
      }
    }
    return healthStatus;
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
        healthMap.set(allExchanges[i].name, 'dead' as HEALTH_STATE);
        this.logger.error(`Exchange ${allExchanges[i].name} is dead`);
      }
    }

    const responses = await Promise.all(allRequests);
    for (let i = 0; i < responses.length; i++) {
      if (!responses[i]) {
        // there is no field like balance in responses[i]
        healthMap.set(allExchanges[i].name, 'dead' as HEALTH_STATE);
        this.logger.error(`Exchange ${allExchanges[i].name} is dead`);
      } else {
        healthMap.set(allExchanges[i].name, 'alive' as HEALTH_STATE);
      }
    }

    const result = Array.from(healthMap, ([key, value]) => ({ [key]: value }));
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
    return { code: 200, message: 'alive' as HEALTH_STATE };
  }
}
