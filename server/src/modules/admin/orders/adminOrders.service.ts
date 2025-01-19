import { Injectable } from '@nestjs/common';
import { CustomLogger } from 'src/modules/logger/logger.service';
import { AdminOrdersRepository } from './adminOrders.repository';

@Injectable()
export class AdminOrdersService {
  private readonly logger = new CustomLogger(AdminOrdersService.name);
  constructor(private adminOrdersRepository: AdminOrdersRepository) {}

  async getAllOrders() {
    const spotOrders = await this.adminOrdersRepository.getAllSpotOrders();
    const arbitrageOrders =
      await this.adminOrdersRepository.getAllArbitrageOrders();
    const marketMakingOrders =
      await this.adminOrdersRepository.getAllMarketMakingOrders();
    const simplyGrowOrders =
      await this.adminOrdersRepository.getAllSimplyGrowOrders();
    return {
      spot: spotOrders,
      arbitrage: arbitrageOrders,
      market_making: marketMakingOrders,
      simply_grow: simplyGrowOrders,
    };
  }

  async getArbitrageOrdersByUserId(userId: string) {
    return this.adminOrdersRepository.getArbitrageOrders(userId);
  }

  async getAllArbitrageOrders() {
    return this.adminOrdersRepository.getAllArbitrageOrders();
  }

  async getSpotOrdersByUserId(userId: string) {
    return this.adminOrdersRepository.getSpotOrders(userId);
  }

  async getAllSpotOrders() {
    return this.adminOrdersRepository.getAllSpotOrders();
  }

  async getMarketMakingOrdersByUserId(userId: string) {
    return this.adminOrdersRepository.getMarketMakingOrders(userId);
  }

  async getAllMarketMakingOrders() {
    return this.adminOrdersRepository.getAllMarketMakingOrders();
  }

  async getSimplyGrowOrdersByUserId(userId: string) {
    return this.adminOrdersRepository.getSimplyGrowOrders(userId);
  }

  async getAllSimplyGrowOrders() {
    return this.adminOrdersRepository.getAllSimplyGrowOrders();
  }
}
