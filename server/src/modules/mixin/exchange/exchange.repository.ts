// exchange.repository.ts
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { APIKeysConfig } from 'src/common/entities/api-keys.entity';

@Injectable()
export class ExchangeRepository {
  constructor(
    @InjectRepository(APIKeysConfig)
    private readonly apiKeysRepository: Repository<APIKeysConfig>,
  ) {}

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

  async readAllAPIKeys(): Promise<string[]> {
    await this.apiKeysRepository.find();
    return [];
  }

  async readAllAPIKeysByExchange(exchange: string): Promise<APIKeysConfig[]> {
    return await this.apiKeysRepository.find({ where: { exchange } });
  }
}
