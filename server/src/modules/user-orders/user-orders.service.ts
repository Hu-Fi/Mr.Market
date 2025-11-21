import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { CustomLogger } from 'src/modules/logger/logger.service';
import { StrategyService } from 'src/modules/strategy/strategy.service';
import { createStrategyKey } from 'src/common/helpers/strategyKey';
import {
  ArbitrageOrder,
  MarketMakingOrder,
  PaymentState,
  SimplyGrowOrder,
} from 'src/common/entities/strategy-user.entity';
import {
  ArbitrageStates,
  MarketMakingStates,
  SimplyGrowStates,
} from 'src/common/types/orders/states';
import { MarketMakingHistory } from 'src/common/entities/market-making-order.entity';
import { ArbitrageHistory } from 'src/common/entities/arbitrage-order.entity';

@Injectable()
export class UserOrdersService {
  private readonly logger = new CustomLogger(UserOrdersService.name);

  constructor(
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => StrategyService))
    private readonly strategyService: StrategyService,
    @InjectRepository(ArbitrageOrder)
    private readonly arbitrageRepository: Repository<ArbitrageOrder>,
    @InjectRepository(MarketMakingOrder)
    private readonly marketMakingRepository: Repository<MarketMakingOrder>,
    @InjectRepository(PaymentState)
    private readonly paymentStateRepository: Repository<PaymentState>,
    @InjectRepository(SimplyGrowOrder)
    private readonly simplyGrowRepository: Repository<SimplyGrowOrder>,
    @InjectRepository(MarketMakingHistory)
    private readonly marketMakingHistoryRepository: Repository<MarketMakingHistory>,
    @InjectRepository(ArbitrageHistory)
    private readonly arbitrageHistoryRepository: Repository<ArbitrageHistory>,
  ) { }

  async findAllStrategyByUser(userId: string) {
    try {
      const arbitrages = await this.arbitrageRepository.findBy({ userId });
      const market_makings = await this.marketMakingRepository.findBy({ userId });
      const simply_grows = await this.simplyGrowRepository.findBy({ userId });
      return {
        arbitrage: arbitrages,
        market_making: market_makings,
        simply_grow: simply_grows,
        total: arbitrages.length + market_makings.length + simply_grows.length,
      };
    } catch (error) {
      this.logger.error('Error finding all strategy by user', error);
      return { arbitrage: [], market_making: [], simply_grow: [], total: 0 };
    }
  }

  async createSimplyGrow(simplyGrowOrder: SimplyGrowOrder): Promise<SimplyGrowOrder> {
    try {
      return await this.simplyGrowRepository.save(simplyGrowOrder);
    } catch (error) {
      this.logger.error('Error creating simply grow order', error);
      throw error;
    }
  }

  async findSimplyGrowByOrderId(orderId: string): Promise<SimplyGrowOrder | undefined> {
    return await this.simplyGrowRepository.findOneBy({ orderId });
  }

  async findSimplyGrowByUserId(userId: string): Promise<SimplyGrowOrder[]> {
    return await this.simplyGrowRepository.findBy({ userId });
  }

  async updateSimplyGrowState(orderId: string, newState: SimplyGrowStates): Promise<void> {
    try {
      await this.simplyGrowRepository.update({ orderId }, { state: newState });
    } catch (error) {
      this.logger.error('Error updating simply grow state', error);
      throw error;
    }
  }

  async createArbitrage(arbitrageOrder: ArbitrageOrder): Promise<ArbitrageOrder> {
    try {
      return await this.arbitrageRepository.save(arbitrageOrder);
    } catch (error) {
      this.logger.error('Error creating arbitrage order', error.message);
      throw error;
    }
  }

  async findArbitrageByOrderId(orderId: string): Promise<ArbitrageOrder | undefined> {
    try {
      return await this.arbitrageRepository.findOneBy({ orderId });
    } catch (error) {
      this.logger.error('Error finding arbitrage order by orderId', error.message);
      throw error;
    }
  }

  async findArbitrageByUserId(userId: string): Promise<ArbitrageOrder[]> {
    try {
      return await this.arbitrageRepository.findBy({ userId });
    } catch (error) {
      this.logger.error('Error finding arbitrage orders by userId', error.message);
      throw error;
    }
  }

  async updateArbitrageOrderState(orderId: string, newState: ArbitrageStates): Promise<void> {
    try {
      await this.arbitrageRepository.update({ orderId }, { state: newState });
      this.logger.log(`Arbitrage order ${orderId} updated successfully to state ${newState}`);
    } catch (error) {
      this.logger.error(`Error updating arbitrage order state for orderId ${orderId}`, error.message);
      throw error;
    }
  }

  async createMarketMaking(marketMakingOrder: MarketMakingOrder): Promise<MarketMakingOrder> {
    try {
      return await this.marketMakingRepository.save(marketMakingOrder);
    } catch (error) {
      this.logger.error('Error creating market making order', error.message);
      throw error;
    }
  }

  async findMarketMakingByOrderId(orderId: string): Promise<MarketMakingOrder | undefined> {
    try {
      return await this.marketMakingRepository.findOneBy({ orderId });
    } catch (error) {
      this.logger.error('Error finding market making order by orderId', error.message);
      throw error;
    }
  }

  async findMarketMakingByUserId(userId: string): Promise<MarketMakingOrder[]> {
    try {
      return await this.marketMakingRepository.findBy({ userId });
    } catch (error) {
      this.logger.error('Error finding market making orders by userId', error.message);
      throw error;
    }
  }

  async updateMarketMakingOrderState(orderId: string, newState: MarketMakingStates): Promise<void> {
    try {
      await this.marketMakingRepository.update({ orderId }, { state: newState });
      this.logger.log(`Market making order ${orderId} updated successfully to state ${newState}`);
    } catch (error) {
      this.logger.error(`Error updating market making order state for orderId ${orderId}`, error.message);
      throw error;
    }
  }

  async createPaymentState(paymentState: PaymentState): Promise<PaymentState> {
    return await this.paymentStateRepository.save(paymentState);
  }

  async findPaymentStateById(orderId: string) {
    try {
      const result = await this.paymentStateRepository.findOneBy({ orderId });
      if (!result) {
        return { code: 404, message: 'Not found', data: {} };
      } else {
        return { code: 200, message: 'Found', data: result };
      }
    } catch (error) {
      this.logger.error('Error finding state by id', error.message);
      return { code: 404, message: 'Not found', data: {} };
    }
  }

  async findPaymentStateByIdRaw(orderId: string) {
    return await this.paymentStateRepository.findOneBy({ orderId });
  }

  async findPaymentStateByState(state: string): Promise<PaymentState[]> {
    return await this.paymentStateRepository.findBy({ state });
  }

  async updatePaymentStateById(orderId: string, newPaymentState: Partial<PaymentState>) {
    const updateResult = await this.paymentStateRepository.update({ orderId }, newPaymentState);
    if (updateResult.affected === 0) {
      return null;
    }
    return updateResult;
  }

  // Methods moved from StrategyService
  async getUserOrders(userId: string): Promise<MarketMakingHistory[]> {
    return await this.marketMakingHistoryRepository.find({
      where: { userId },
      order: { executedAt: 'DESC' },
    });
  }

  async getUserArbitrageHistorys(userId: string): Promise<ArbitrageHistory[]> {
    return await this.arbitrageHistoryRepository.find({
      where: { userId },
      order: { executedAt: 'DESC' },
    });
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
        // Logic was empty in original file, keeping it empty or TODO
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
    const activeArb = await this.arbitrageRepository.findBy({ state: 'created' });
    const activeMM = await this.marketMakingRepository.findBy({ state: 'created' });

    if (activeArb) {
      activeArb.forEach(async (arb) => {
        const key = createStrategyKey({
          user_id: arb.userId,
          client_id: arb.orderId,
          type: 'arbitrage',
        });
        // TODO: FIX THIS HARDCODE -ERC20
        await this.strategyService.startArbitrageIfNotStarted(
          key,
          {
            ...arb,
            pair: arb.pair.replaceAll('-ERC20', ''),
            clientId: arb.orderId,
            amountToTrade: Number(arb.amountToTrade),
            minProfitability: Number(arb.minProfitability),
          },
          15, // example value for checkIntervalSeconds
          1, // example value for maxOpenOrders
        );
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

    const pausedArb = await this.arbitrageRepository.findBy({ state: 'paused' });
    const pausedMM = await this.marketMakingRepository.findBy({ state: 'paused' });

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
