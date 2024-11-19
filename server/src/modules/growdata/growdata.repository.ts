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
    return await this.exchangeRepository.remove(exchange);
  }

  async updateExchange(
    exchange_id: string,
    updateData: Partial<GrowdataExchange>,
  ) {
    return this.exchangeRepository.update({ exchange_id }, updateData);
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
    return await this.simplyGrowTokenRepository.remove(token);
  }

  async updateSimplyGrowToken(
    asset_id: string,
    updateData: Partial<GrowdataSimplyGrowToken>,
  ) {
    return this.simplyGrowTokenRepository.update({ asset_id }, updateData);
  }

  // ArbitragePair Methods
  async addArbitragePair(pair: GrowdataArbitragePair) {
    return this.arbitragePairRepository.save(pair);
  }

  async findAllArbitragePairs() {
    return this.arbitragePairRepository.find();
  }

  async findArbitragePairById(id: string) {
    return this.arbitragePairRepository.findOne({
      where: { id },
    });
  }

  async removeArbitragePair(id: string) {
    const pair = await this.arbitragePairRepository.findOne({
      where: { id },
    });
    if (!pair) {
      return;
    }
    return await this.arbitragePairRepository.remove(pair);
  }

  async updateArbitragePair(
    id: string,
    updateData: Partial<GrowdataArbitragePair>,
  ) {
    return this.arbitragePairRepository.update({ id }, updateData);
  }

  // MarketMakingPair Methods
  async addMarketMakingPair(pair: GrowdataMarketMakingPair) {
    return this.marketMakingPairRepository.save(pair);
  }

  async findAllMarketMakingPairs() {
    return this.marketMakingPairRepository.find();
  }

  async findMarketMakingPairById(id: string) {
    return this.marketMakingPairRepository.findOne({
      where: { id },
    });
  }

  async removeMarketMakingPair(id: string) {
    const pair = await this.marketMakingPairRepository.findOne({
      where: { id },
    });
    if (!pair) {
      return;
    }
    return await this.marketMakingPairRepository.remove(pair);
  }

  async updateMarketMakingPair(
    id: string,
    updateData: Partial<GrowdataMarketMakingPair>,
  ) {
    return this.marketMakingPairRepository.update({ id }, updateData);
  }
}
