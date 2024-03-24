import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  RebalanceExchange,
  CurrencyMinAmount,
} from 'src/common/entities/rebalance-asset.entity';

@Injectable()
export class RebalanceRepository {
  constructor(
    @InjectRepository(RebalanceExchange)
    private readonly rebalanceExchangeRepository: Repository<RebalanceExchange>,
    @InjectRepository(CurrencyMinAmount)
    private readonly currencyMinAmountRepository: Repository<CurrencyMinAmount>,
  ) {}

  // Exchange operations
  async createExchange(name: string): Promise<RebalanceExchange> {
    const newExchange = this.rebalanceExchangeRepository.create({ name });
    return this.rebalanceExchangeRepository.save(newExchange);
  }

  async removeExchange(mixinAssetId: string): Promise<void> {
    await this.rebalanceExchangeRepository.delete(mixinAssetId);
  }

  async findAllExchanges(): Promise<RebalanceExchange[]> {
    return this.rebalanceExchangeRepository.find({
      relations: ['currencyMinAmounts'],
    });
  }

  // Currency operations
  async getCurrencyMinAmountBySymbol(
    exchangeId: string,
    symbol: string,
  ): Promise<CurrencyMinAmount | null> {
    return await this.currencyMinAmountRepository.findOne({
      where: {
        exchangeId: exchangeId,
        symbol: symbol,
      },
    });
  }

  async addCurrencyMinAmount(
    exchangeId: string,
    symbol: string,
    minimumBalance: string,
  ): Promise<CurrencyMinAmount> {
    const newCurrencyMinAmount = this.currencyMinAmountRepository.create({
      exchangeId,
      symbol,
      minium_balance: minimumBalance,
    });
    return this.currencyMinAmountRepository.save(newCurrencyMinAmount);
  }

  async updateCurrencyMinAmount(
    mixinAssetId: string,
    newMinimumBalance: string,
  ): Promise<void> {
    await this.currencyMinAmountRepository.update(mixinAssetId, {
      minium_balance: newMinimumBalance,
    });
  }

  async removeCurrencyMinAmount(mixinAssetId: string): Promise<void> {
    await this.currencyMinAmountRepository.delete(mixinAssetId);
  }

  async listCurrenciesForExchange(
    exchangeId: string,
  ): Promise<CurrencyMinAmount[]> {
    return this.currencyMinAmountRepository.find({ where: { exchangeId } });
  }
}
