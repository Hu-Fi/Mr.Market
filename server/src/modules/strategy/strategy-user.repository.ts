import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ArbitrageOrder,
  MarketMakingOrder,
} from 'src/common/entities/strategy.entity';
import {
  ArbitrageStates,
  MarketMakingStates,
} from 'src/common/types/orders/states';

@Injectable()
export class StrategyUserRepository {
  constructor(
    @InjectRepository(ArbitrageOrder)
    private readonly arbitrageRepository: Repository<ArbitrageOrder>,
    @InjectRepository(MarketMakingOrder)
    private readonly marketMakingRepository: Repository<MarketMakingOrder>,
  ) {}

  async createArbitrage(
    arbitrageOrder: ArbitrageOrder,
  ): Promise<ArbitrageOrder> {
    return this.arbitrageRepository.save(arbitrageOrder);
  }

  async findArbitrageByOrderId(
    orderId: string,
  ): Promise<ArbitrageOrder | undefined> {
    return this.arbitrageRepository.findOneBy({ orderId });
  }

  async findArbitrageByUserId(userId: string): Promise<ArbitrageOrder[]> {
    return this.arbitrageRepository.findBy({ userId });
  }

  async updateArbitrageOrderState(
    orderId: string,
    newState: ArbitrageStates,
  ): Promise<void> {
    const arbitrageOrder = await this.arbitrageRepository.findOneBy({
      orderId,
    });
    if (!arbitrageOrder) {
      throw new Error('ArbitrageOrder not found');
    }
    arbitrageOrder.state = newState;
    await this.arbitrageRepository.save(arbitrageOrder);
  }

  async createMarketMaking(
    marketMakingOrder: MarketMakingOrder,
  ): Promise<MarketMakingOrder> {
    return this.marketMakingRepository.save(marketMakingOrder);
  }

  async findMarketMakingByOrderId(
    orderId: string,
  ): Promise<MarketMakingOrder | undefined> {
    return this.marketMakingRepository.findOneBy({ orderId });
  }

  async findMarketMakingByUserId(userId: string): Promise<MarketMakingOrder[]> {
    return this.marketMakingRepository.findBy({ userId });
  }

  async updateMarketMakingOrderState(
    orderId: string,
    newState: MarketMakingStates,
  ): Promise<void> {
    const marketMakingOrder = await this.marketMakingRepository.findOneBy({
      orderId,
    });
    if (!marketMakingOrder) {
      throw new Error('MarketMakingOrder not found');
    }
    marketMakingOrder.state = newState;
    await this.marketMakingRepository.save(marketMakingOrder);
  }
}
