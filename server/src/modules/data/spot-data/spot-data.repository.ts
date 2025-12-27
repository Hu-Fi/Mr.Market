import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SpotdataTradingPair } from 'src/common/entities/spot-data.entity';

@Injectable()
export class SpotdataRepository {
  constructor(
    @InjectRepository(SpotdataTradingPair)
    private readonly tradingPairRepository: Repository<SpotdataTradingPair>,
  ) {}

  // TradingPair Methods
  async addTradingPair(pair: SpotdataTradingPair) {
    return this.tradingPairRepository.save(pair);
  }

  async findAllTradingPairs() {
    return this.tradingPairRepository.find();
  }

  async findTradingPairById(id: string) {
    return this.tradingPairRepository.findOne({
      where: { id },
    });
  }

  async findTradingPairByExchangeAndSymbol(
    exchange_id: string,
    symbol: string,
  ) {
    return this.tradingPairRepository.findOne({
      where: { exchange_id, symbol },
    });
  }

  async removeTradingPair(id: string) {
    const pair = await this.tradingPairRepository.findOne({
      where: { id },
    });
    if (!pair) {
      return;
    }
    return await this.tradingPairRepository.remove(pair);
  }

  async updateTradingPair(
    id: string,
    updateData: Partial<SpotdataTradingPair>,
  ) {
    return this.tradingPairRepository.update({ id }, updateData);
  }
}
