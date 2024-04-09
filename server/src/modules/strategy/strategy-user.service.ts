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
import { StrategyService } from 'src/modules/strategy/strategy.service';
import { StrategyUserRepository } from 'src/modules/strategy/strategy-user.repository';
import { createStrategyKey } from 'src/common/helpers/strategyKey';

@Injectable()
export class StrategyUserService {
  private readonly logger = new CustomLogger(StrategyUserService.name);

  constructor(
    private readonly strategyService: StrategyService,
    private readonly strategyUserRepository: StrategyUserRepository,
  ) {}

  async findAllStrategyByUser(userId: string) {
    try {
      const arbitrages =
        await this.strategyUserRepository.findArbitrageByUserId(userId);
      const market_makings =
        await this.strategyUserRepository.findMarketMakingByUserId(userId);
      return [...arbitrages, ...market_makings];
    } catch (error) {
      this.logger.error('Error finding all strategy by user', error);
      return [];
    }
  }

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

  async findPaymentStateByState(state: string): Promise<PaymentState[]> {
    return await this.strategyUserRepository.findPaymentStateByState(state);
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
    const created = await this.findPaymentStateByState('created');
    // Check if created time over timeout 10m
    created.forEach((item) => {
      // check if timeout, refund if timeout, update state to timeout
      if (item.createdAt) {
      }
    });
  }

  // Get all created order to run in strategy
  @Cron('*/60 * * * * *') // 60s
  async updateExecutionBasedOnOrders() {
    // Get orders states that are created
    const activeArb =
      await this.strategyUserRepository.findRunningArbitrageOrders();
    const activeMM =
      await this.strategyUserRepository.findRunningMarketMakingOrders();
    if (activeArb) {
      activeArb.forEach(async (arb) => {
        const key = createStrategyKey({
          user_id: arb.userId,
          client_id: arb.orderId,
          type: 'arbitrage',
        });
        await this.strategyService.startArbitrageIfNotStarted(key, {
          ...arb,
          clientId: arb.orderId,
          amountToTrade: Number(arb.amountToTrade),
          minProfitability: Number(arb.minProfitability),
        });
      });
    }
    if (activeMM) {
      activeMM.forEach(async (mm) => {
        const key = createStrategyKey({
          user_id: mm.userId,
          client_id: mm.orderId,
          type: 'pureMarketMaking',
        });
        await this.strategyService.startMarketMakingIfNotStarted(key, {
          ...mm,
          clientId: mm.orderId,
          bidSpread: Number(mm.bidSpread),
          askSpread: Number(mm.askSpread),
          orderAmount: Number(mm.orderAmount),
          orderRefreshTime: Number(mm.orderRefreshTime),
          numberOfLayers: Number(mm.numberOfLayers),
          amountChangePerLayer: Number(mm.amountChangePerLayer),
          ceilingPrice: Number(mm.ceilingPrice),
          floorPrice: Number(mm.floorPrice),
        });
      });
    }
  }
}
