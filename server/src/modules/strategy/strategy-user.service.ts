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
import { ConfigService } from '@nestjs/config';
import { CustomLogger } from 'src/modules/logger/logger.service';
import { StrategyService } from 'src/modules/strategy/strategy.service';
import { StrategyUserRepository } from 'src/modules/strategy/strategy-user.repository';
import { createStrategyKey } from 'src/common/helpers/strategyKey';

@Injectable()
export class StrategyUserService {
  private readonly logger = new CustomLogger(StrategyUserService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly strategyService: StrategyService,
    private readonly strategyUserRepository: StrategyUserRepository,
  ) {}

  async findAllStrategyByUser(userId: string) {
    try {
      const arbitrages =
        await this.strategyUserRepository.findArbitrageByUserId(userId);
      const market_makings =
        await this.strategyUserRepository.findMarketMakingByUserId(userId);
      return {
        arbitrage: arbitrages,
        market_making: market_makings,
        total: arbitrages.length + market_makings.length,
      };
    } catch (error) {
      this.logger.error('Error finding all strategy by user', error);
      return { arbitrage: [], market_making: [], total: 0 };
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

  async findPaymentStateById(orderId: string) {
    try {
      const result =
        await this.strategyUserRepository.findPaymentStateByOrderId(orderId);
      if (!result) {
        return { code: 404, message: 'Not found', data: {} };
      } else {
        return { code: 200, message: 'Found', data: result };
      }
    } catch (error) {
      this.logger.error('Error finding state by id', error);
      return { code: 404, message: 'Not found', data: {} };
    }
  }

  async findPaymentStateByIdRaw(orderId: string) {
    return await this.strategyUserRepository.findPaymentStateByOrderId(orderId);
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
    const enabled = this.configService.get<string>('strategy.run');
    if (enabled === 'false') {
      return;
    }

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
        // TODO: FIX THIS HARDCODE -ERC20
        await this.strategyService.startArbitrageIfNotStarted(key, {
          ...arb,
          pair: arb.pair.replaceAll('-ERC20', ''),
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
        // TODO: FIX THIS HARDCODE -ERC20
        await this.strategyService.startMarketMakingIfNotStarted(key, {
          ...mm,
          pair: mm.pair.replaceAll('-ERC20', ''),
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

    const pausedArb =
      await this.strategyUserRepository.findPausedArbitrageOrders();
    const pausedMM =
      await this.strategyUserRepository.findPausedMarketMakingOrders();
    if (pausedArb) {
      pausedArb.forEach(async (arb) => {
        await this.strategyService.pauseStrategyIfNotPaused({
          type: 'arbitrage',
          user_id: arb.userId,
          client_id: arb.orderId,
        });
      });
    }
    if (pausedMM) {
      pausedMM.forEach(async (mm) => {
        await this.strategyService.pauseStrategyIfNotPaused({
          type: 'pureMarketMaking',
          user_id: mm.userId,
          client_id: mm.orderId,
        });
      });
    }
  }
}
