import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SpotOrderStatus } from 'src/common/types/orders/states';
import { SpotOrder } from 'src/common/entities/spot-order.entity';
import { exchangeAPIKeysConfig } from 'src/common/entities/exchange-api-keys.entity';
import {
  MixinReleaseHistory,
  MixinReleaseToken,
} from 'src/common/entities/mixin-release.entity';

@Injectable()
export class ExchangeRepository {
  constructor(
    @InjectRepository(exchangeAPIKeysConfig)
    private readonly apiKeysRepository: Repository<exchangeAPIKeysConfig>,
    @InjectRepository(SpotOrder)
    private readonly spotOrderRepository: Repository<SpotOrder>,
    @InjectRepository(MixinReleaseToken)
    private readonly mixinReleaseRepository: Repository<MixinReleaseToken>,
    @InjectRepository(MixinReleaseHistory)
    private readonly mixinReleaseHistoryRepository: Repository<MixinReleaseHistory>,
  ) {}

  // API Key related methods
  async addAPIKey(apiKey: exchangeAPIKeysConfig) {
    return this.apiKeysRepository.save(apiKey);
  }

  async readAPIKey(key_id: string) {
    return await this.apiKeysRepository.findOne({
      where: { key_id },
    });
  }

  async removeAPIKey(key_id: string) {
    const apiKey = await this.apiKeysRepository.findOne({
      where: { key_id },
    });
    if (!apiKey) {
      // Handle key not found error
      return;
    }
    await this.apiKeysRepository.remove(apiKey);
  }

  async readAllAPIKeys(): Promise<exchangeAPIKeysConfig[]> {
    return await this.apiKeysRepository.find();
  }

  async readAllAPIKeysByExchange(
    exchange: string,
  ): Promise<exchangeAPIKeysConfig[]> {
    return await this.apiKeysRepository.find({ where: { exchange } });
  }

  async readOrderByUser(userId: string): Promise<SpotOrder[]> {
    let orders = await this.spotOrderRepository.find({ where: { userId } });
    orders = orders.map((order) => {
      delete order.apiKeyId;
      return order;
    });
    return orders;
  }

  async readOrderByID(orderId: string): Promise<SpotOrder> {
    const order = await this.spotOrderRepository.findOne({
      where: { orderId },
    });
    delete order.apiKeyId;
    return order;
  }

  async readOrdersByState(state: SpotOrderStatus): Promise<SpotOrder[]> {
    return await this.spotOrderRepository.find({ where: { state } });
  }

  async readAllSpotOrders(): Promise<SpotOrder[]> {
    return this.spotOrderRepository.find();
  }

  async createSpotOrder(
    transactionData: Partial<SpotOrder>,
  ): Promise<SpotOrder> {
    const transaction = this.spotOrderRepository.create(transactionData);
    return await this.spotOrderRepository.save(transaction);
  }

  async updateSpotOrderState(orderId: string, state: SpotOrderStatus) {
    return await this.spotOrderRepository.update({ orderId }, { state });
  }

  async updateSpotOrderUpdatedAt(orderId: string, updatedAt: string) {
    return await this.spotOrderRepository.update({ orderId }, { updatedAt });
  }

  async updateSpotOrderApiKeyId(orderId: string, apiKeyId: string) {
    return await this.spotOrderRepository.update({ orderId }, { apiKeyId });
  }

  async addMixinReleaseToken(transactionData: Partial<MixinReleaseToken>) {
    const transaction = this.mixinReleaseRepository.create(transactionData);
    return await this.mixinReleaseRepository.save(transaction);
  }

  async readMixinReleaseToken(orderId: string) {
    return await this.mixinReleaseRepository.findOne({ where: { orderId } });
  }

  async readMixinReleaseHistory(orderId: string) {
    return await this.mixinReleaseHistoryRepository.exists({
      where: { orderId },
    });
  }

  async addMixinReleaseHistory(transactionData: Partial<MixinReleaseHistory>) {
    const transaction =
      this.mixinReleaseHistoryRepository.create(transactionData);
    return await this.mixinReleaseHistoryRepository.save(transaction);
  }
}
