import { Injectable } from '@nestjs/common';
import { GrowdataService } from 'src/modules/growdata/growdata.service';
import {
  GrowdataExchange,
  GrowdataSimplyGrowToken,
  GrowdataArbitragePair,
  GrowdataMarketMakingPair,
} from 'src/common/entities/growdata.entity';

@Injectable()
export class AdminGrowService {
  constructor(private readonly growDataService: GrowdataService) {}

  // Exchange

  // Add exchange
  async addExchange(exchange: GrowdataExchange) {
    return this.growDataService.addExchange(exchange);
  }

  // Remove exchange
  async removeExchange(exchange_id: string) {
    return this.growDataService.removeExchange(exchange_id);
  }

  // Remove all exchanges
  async removeAllExchanges() {
    const exchanges = await this.growDataService.getAllExchanges();
    for (const exchange of exchanges) {
      await this.growDataService.removeExchange(exchange.exchange_id);
    }
  }

  // Modify exchange (pause/resume/modify)
  async updateExchange(
    exchange_id: string,
    modifications: Partial<GrowdataExchange>,
  ) {
    const exchange = await this.growDataService.getExchangeById(exchange_id);
    if (exchange) {
      Object.assign(exchange, modifications);
      // Assuming there's a method to update the token
      return this.growDataService.addExchange(exchange);
    }
  }

  // SimplyGrow token

  // Add simplyGrow token
  async addSimplyGrowToken(token: GrowdataSimplyGrowToken) {
    return this.growDataService.addSimplyGrowToken(token);
  }

  // Remove simplyGrow token
  async removeSimplyGrowToken(asset_id: string) {
    return this.growDataService.removeSimplyGrowToken(asset_id);
  }

  // Remove all simplyGrow tokens
  async removeAllSimplyGrowTokens() {
    const tokens = await this.growDataService.getAllSimplyGrowTokens();
    for (const token of tokens) {
      await this.growDataService.removeSimplyGrowToken(token.asset_id);
    }
  }

  // Modify simplyGrow token (pause/resume/modify)
  async updateSimplyGrowToken(
    asset_id: string,
    modifications: Partial<GrowdataSimplyGrowToken>,
  ) {
    const token = await this.growDataService.getSimplyGrowTokenById(asset_id);
    if (token) {
      Object.assign(token, modifications);
      // Assuming there's a method to update the token
      return this.growDataService.addSimplyGrowToken(token);
    }
  }

  // Market making

  // Add market making trading pair
  async addMarketMakingPair(pair: GrowdataMarketMakingPair) {
    return this.growDataService.addMarketMakingPair(pair);
  }

  // Remove market making trading pair
  async removeMarketMakingPair(symbol: string) {
    return this.growDataService.removeMarketMakingPair(symbol);
  }

  // Remove all market making trading pairs
  async removeAllMarketMakingPairs() {
    const pairs = await this.growDataService.getAllMarketMakingPairs();
    for (const pair of pairs) {
      await this.growDataService.removeMarketMakingPair(pair.symbol);
    }
  }

  // Modify market making trading pair (pause/resume/modify)
  async updateMarketMakingPair(
    symbol: string,
    modifications: Partial<GrowdataMarketMakingPair>,
  ) {
    const pair = await this.growDataService.getMarketMakingPairById(symbol);
    if (pair) {
      Object.assign(pair, modifications);
      // Assuming there's a method to update the pair
      return this.growDataService.addMarketMakingPair(pair);
    }
  }

  // Arbitrage

  // Add arbitrage trading pair
  async addArbitragePair(pair: GrowdataArbitragePair) {
    return this.growDataService.addArbitragePair(pair);
  }

  // Remove arbitrage trading pair
  async removeArbitragePair(symbol: string) {
    return this.growDataService.removeArbitragePair(symbol);
  }

  // Remove all arbitrage trading pairs
  async removeAllArbitragePairs() {
    const pairs = await this.growDataService.getAllArbitragePairs();
    for (const pair of pairs) {
      await this.growDataService.removeArbitragePair(pair.symbol);
    }
  }

  // Modify arbitrage trading pair (pause/resume/modify)
  async updateArbitragePair(
    symbol: string,
    modifications: Partial<GrowdataArbitragePair>,
  ) {
    const pair = await this.growDataService.getArbitragePairById(symbol);
    if (pair) {
      Object.assign(pair, modifications);
      // Assuming there's a method to update the pair
      return this.growDataService.addArbitragePair(pair);
    }
  }
}
