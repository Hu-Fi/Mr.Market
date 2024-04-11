import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ArbitrageOrder,
  MarketMakingOrder,
  PaymentState,
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
    @InjectRepository(PaymentState)
    private readonly paymentStateRepository: Repository<PaymentState>,
  ) {}

  async findPaymentStateByOrderId(
    orderId: string,
  ): Promise<PaymentState | undefined> {
    return this.paymentStateRepository.findOneBy({ orderId });
  }

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

  async findRunningArbitrageOrders(): Promise<ArbitrageOrder[]> {
    return this.arbitrageRepository.findBy({ state: 'created' });
  }

  async findPausedArbitrageOrders(): Promise<ArbitrageOrder[]> {
    return this.arbitrageRepository.findBy({ state: 'paused' });
  }

  async updateArbitrageOrderState(orderId: string, newState: ArbitrageStates) {
    return await this.arbitrageRepository.update(
      { orderId },
      { state: newState },
    );
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

  async findRunningMarketMakingOrders(): Promise<MarketMakingOrder[]> {
    return this.marketMakingRepository.findBy({ state: 'created' });
  }

  async findPausedMarketMakingOrders(): Promise<MarketMakingOrder[]> {
    return this.marketMakingRepository.findBy({ state: 'paused' });
  }

  async updateMarketMakingOrderState(
    orderId: string,
    newState: MarketMakingStates,
  ) {
    return await this.marketMakingRepository.update(
      { orderId },
      { state: newState },
    );
  }

  async createPaymentState(paymentState: PaymentState): Promise<PaymentState> {
    return this.paymentStateRepository.save(paymentState);
  }

  async findPaymentStateById(orderId: string): Promise<PaymentState> {
    return this.paymentStateRepository.findOneBy({ orderId });
  }

  async findPaymentStateByState(state: string): Promise<PaymentState[]> {
    return this.paymentStateRepository.findBy({ state });
  }

  async updatePaymentStateById(
    orderId: string,
    newPaymentState: Partial<PaymentState>,
  ) {
    const updateResult = await this.paymentStateRepository.update(
      { orderId },
      newPaymentState,
    );

    if (updateResult.affected === 0) {
      return null;
    }
    return updateResult;
  }
}
