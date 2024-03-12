import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SpotOrderStatus } from 'src/common/types/orders/orders';
import { SpotOrder } from 'src/common/entities/spot-order.entity';
import { APIKeysConfig } from 'src/common/entities/api-keys.entity';

@Injectable()
export class ExchangeRepository {
  constructor(
    @InjectRepository(APIKeysConfig)
    private readonly apiKeysRepository: Repository<APIKeysConfig>,
    @InjectRepository(SpotOrder)
    private readonly spotOrderRepository: Repository<SpotOrder>,
  ) {}

  // API Key related methods
  async addAPIKey(apiKey: APIKeysConfig) {
    return this.apiKeysRepository.save(apiKey);
  }

  async removeAPIKey(keyId: string) {
    const apiKey = await this.apiKeysRepository.findOne({
      where: { key_id: keyId },
    });
    if (!apiKey) {
      // Handle key not found error
      return;
    }
    await this.apiKeysRepository.remove(apiKey);
  }

  async readAllAPIKeys(): Promise<APIKeysConfig[]> {
    return await this.apiKeysRepository.find();
  }

  async readAllAPIKeysByExchange(exchange: string): Promise<APIKeysConfig[]> {
    return await this.apiKeysRepository.find({ where: { exchange } });
  }

  async getOrderByID(order_id: string): Promise<SpotOrder[]> {
    return this.spotOrderRepository.find({ where: { order_id } });
  }

  async getOrderByState(state: SpotOrderStatus): Promise<SpotOrder[]> {
    return this.spotOrderRepository.find({ where: { state } });
  }

  async createSpotOrder(
    transactionData: Partial<SpotOrder>,
  ): Promise<SpotOrder> {
    const transaction = this.spotOrderRepository.create(transactionData);
    return this.spotOrderRepository.save(transaction);
  }

  async updateSpotOrderState(order_id: string, state: SpotOrderStatus) {
    return this.spotOrderRepository.update({ order_id }, { state });
  }
}
