import { Injectable } from '@nestjs/common';
import {
  ArbitrageOrder,
  MarketMakingOrder,
  SimplyGrowOrder,
} from 'src/common/entities/strategy-user.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AdminOrdersRepository {
  constructor(
    @InjectRepository(ArbitrageOrder)
    private readonly arbitrageOrderRepository: Repository<ArbitrageOrder>,
    @InjectRepository(MarketMakingOrder)
    private readonly marketMakingOrderRepository: Repository<MarketMakingOrder>,
    @InjectRepository(SimplyGrowOrder)
    private readonly simplyGrowOrderRepository: Repository<SimplyGrowOrder>,
  ) {}

  async getSpotOrders(userId: string) {
    return userId;
    // return this.spotOrderRepository.find({ where: { userId } });
  }

  async getAllSpotOrders() {
    return this.arbitrageOrderRepository.find();
  }

  async getArbitrageOrders(userId: string) {
    return this.arbitrageOrderRepository.find({ where: { userId } });
  }

  async getAllArbitrageOrders() {
    return this.arbitrageOrderRepository.find();
  }

  async getMarketMakingOrders(userId: string) {
    return this.marketMakingOrderRepository.find({ where: { userId } });
  }

  async getAllMarketMakingOrders() {
    return this.marketMakingOrderRepository.find();
  }

  async getSimplyGrowOrders(userId: string) {
    return this.simplyGrowOrderRepository.find({ where: { userId } });
  }

  async getAllSimplyGrowOrders() {
    return this.simplyGrowOrderRepository.find();
  }
}
