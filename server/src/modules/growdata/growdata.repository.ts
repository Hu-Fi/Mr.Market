import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  GrowdataExchange,
  GrowdataSimplyGrowToken,
  GrowdataArbitragePair,
  GrowdataMarketMakingPair,
} from 'src/common/entities/growdata.entity';

@Injectable()
export class GrowdataRepository {
  constructor(
    @InjectRepository(GrowdataExchange)
    private readonly exchangeRepository: Repository<GrowdataExchange>,
    @InjectRepository(GrowdataSimplyGrowToken)
    private readonly simplyGrowTokenRepository: Repository<GrowdataSimplyGrowToken>,
    @InjectRepository(GrowdataArbitragePair)
    private readonly arbitragePairRepository: Repository<GrowdataArbitragePair>,
    @InjectRepository(GrowdataMarketMakingPair)
    private readonly marketMakingPairRepository: Repository<GrowdataMarketMakingPair>,
  ) {}

  // Exchange Methods
  async addExchange(exchange: GrowdataExchange) {
    return this.exchangeRepository.save(exchange);
  }

  async findAllExchanges() {
    return this.exchangeRepository.find();
  }

  async findExchangeById(exchange_id: string) {
    return this.exchangeRepository.findOne({
      where: { exchange_id },
    });
  }

  async removeExchange(exchange_id: string) {
    const exchange = await this.exchangeRepository.findOne({
      where: { exchange_id },
    });
    if (!exchange) {
      return;
    }
    await this.exchangeRepository.remove(exchange);
  }

  // SimplyGrowToken Methods
  async addSimplyGrowToken(token: GrowdataSimplyGrowToken) {
    return this.simplyGrowTokenRepository.save(token);
  }

  async findAllSimplyGrowTokens() {
    return this.simplyGrowTokenRepository.find();
  }

  async findSimplyGrowTokenById(asset_id: string) {
    return this.simplyGrowTokenRepository.findOne({
      where: { asset_id },
    });
  }

  async removeSimplyGrowToken(asset_id: string) {
    const token = await this.simplyGrowTokenRepository.findOne({
      where: { asset_id },
    });
    if (!token) {
      return;
    }
    await this.simplyGrowTokenRepository.remove(token);
  }

  // ArbitragePair Methods
  async addArbitragePair(pair: GrowdataArbitragePair) {
    return this.arbitragePairRepository.save(pair);
  }

  async findAllArbitragePairs() {
    return this.arbitragePairRepository.find();
  }

  async findArbitragePairById(symbol: string) {
    return this.arbitragePairRepository.findOne({
      where: { symbol },
    });
  }

  async removeArbitragePair(symbol: string) {
    const pair = await this.arbitragePairRepository.findOne({
      where: { symbol },
    });
    if (!pair) {
      return;
    }
    await this.arbitragePairRepository.remove(pair);
  }

  // MarketMakingPair Methods
  async addMarketMakingPair(pair: GrowdataMarketMakingPair) {
    return this.marketMakingPairRepository.save(pair);
  }

  async findAllMarketMakingPairs() {
    return this.marketMakingPairRepository.find();
  }

  async findMarketMakingPairById(symbol: string) {
    return this.marketMakingPairRepository.findOne({
      where: { symbol },
    });
  }

  async removeMarketMakingPair(symbol: string) {
    const pair = await this.marketMakingPairRepository.findOne({
      where: { symbol },
    });
    if (!pair) {
      return;
    }
    await this.marketMakingPairRepository.remove(pair);
  }
}
