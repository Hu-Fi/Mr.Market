// This file is used for creation of strategy order on user side
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import {
  ArbitrageOrder,
  MarketMakingOrder,
  PaymentState,
} from 'src/common/entities/strategy.entity';
import {
  ArbitrageStates,
  MarketMakingStates,
} from 'src/common/types/orders/states';
import { CustomLogger } from 'src/modules/logger/logger.service';
import { StrategyUserRepository } from 'src/modules/strategy/strategy-user.repository';

@Injectable()
export class StrategyUserService {
  private readonly logger = new CustomLogger(StrategyUserService.name);

  constructor(
    private readonly strategyUserRepository: StrategyUserRepository,
  ) {}

  async createArbitrage(
    arbitrageOrder: ArbitrageOrder,
  ): Promise<ArbitrageOrder> {
    try {
      const createdOrder = await this.strategyUserRepository.createArbitrage(
        arbitrageOrder,
      );
      return createdOrder;
    } catch (error) {
      this.logger.error('Error creating arbitrage order', error);
      throw error;
    }
  }

  async findArbitrageByOrderId(
    orderId: string,
  ): Promise<ArbitrageOrder | undefined> {
    try {
      return await this.strategyUserRepository.findArbitrageByOrderId(orderId);
    } catch (error) {
      this.logger.error('Error finding arbitrage order by orderId', error);
      throw error;
    }
  }

  async findArbitrageByUserId(userId: string): Promise<ArbitrageOrder[]> {
    try {
      return await this.strategyUserRepository.findArbitrageByUserId(userId);
    } catch (error) {
      this.logger.error('Error finding arbitrage orders by userId', error);
      throw error;
    }
  }

  async updateArbitrageOrderState(
    orderId: string,
    newState: ArbitrageStates,
  ): Promise<void> {
    try {
      await this.strategyUserRepository.updateArbitrageOrderState(
        orderId,
        newState,
      );
      this.logger.log(
        `Arbitrage order ${orderId} updated successfully to state ${newState}`,
      );
    } catch (error) {
      this.logger.error(
        `Error updating arbitrage order state for orderId ${orderId}`,
        error,
      );
      throw error;
    }
  }

  async createMarketMaking(
    marketMakingOrder: MarketMakingOrder,
  ): Promise<MarketMakingOrder> {
    try {
      const createdOrder = await this.strategyUserRepository.createMarketMaking(
        marketMakingOrder,
      );
      return createdOrder;
    } catch (error) {
      this.logger.error('Error creating market making order', error);
      throw error;
    }
  }

  async findMarketMakingByOrderId(
    orderId: string,
  ): Promise<MarketMakingOrder | undefined> {
    try {
      return await this.strategyUserRepository.findMarketMakingByOrderId(
        orderId,
      );
    } catch (error) {
      this.logger.error('Error finding market making order by orderId', error);
      throw error;
    }
  }

  async findMarketMakingByUserId(userId: string): Promise<MarketMakingOrder[]> {
    try {
      return await this.strategyUserRepository.findMarketMakingByUserId(userId);
    } catch (error) {
      this.logger.error('Error finding market making orders by userId', error);
      throw error;
    }
  }

  async updateMarketMakingOrderState(
    orderId: string,
    newState: MarketMakingStates,
  ): Promise<void> {
    try {
      await this.strategyUserRepository.updateMarketMakingOrderState(
        orderId,
        newState,
      );
      this.logger.log(
        `Market making order ${orderId} updated successfully to state ${newState}`,
      );
    } catch (error) {
      this.logger.error(
        `Error updating market making order state for orderId ${orderId}`,
        error,
      );
      throw error;
    }
  }

  async createPaymentState(paymentState: PaymentState): Promise<PaymentState> {
    return await this.strategyUserRepository.createPaymentState(paymentState);
  }

  async findPaymentStateById(orderId: string): Promise<PaymentState> {
    return await this.strategyUserRepository.findPaymentStateById(orderId);
  }

  async updatePaymentStateById(
    orderId: string,
    newPaymentState: Partial<PaymentState>,
  ) {
    return await this.strategyUserRepository.updatePaymentStateById(
      orderId,
      newPaymentState,
    );
  }

  // Timeout worker
  @Cron('*/60 * * * * *') // 60s
  async clearTimeoutOrders() {
    // Read all PaymentState
    // Check if created time over timeout 10m
    // Update state timeout, refund
  }

  @Cron('*/60 * * * * *') // 60s
  async updateExecutionBasedOnOrders() {
    // Get orders states that are created
    // Check if order is already running in strategy
  }
}
