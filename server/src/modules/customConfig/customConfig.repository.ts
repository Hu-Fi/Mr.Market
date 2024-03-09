import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { APIKeysConfig } from '../../common/entities/api-keys.entity';
import { CustomConfig } from '../../common/entities/custom-config.entity';

@Injectable()
export class CustomConfigRepository {
  constructor(
    @InjectRepository(CustomConfig)
    private readonly customRepository: Repository<CustomConfig>,
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

  async pickAPIKeyOnDemand() {
    // exchange: string, exchangeIndex: string
    // return this.apiKeysRepository.findOne({
    //   where: { exchange, exchangeIndex },
    // });
  }

  async modifySpotFee(configId: number = 0, newSpotFee: string) {
    const config = await this.customRepository.findOne({
      where: { config_id: configId },
    });
    if (!config) {
      // Handle config not found error
      return;
    }
    config.spot_fee = newSpotFee;
    await this.customRepository.save(config);
  }

  async modifyMaxBalanceInMixinBot(
    configId: number = 0,
    newMaxBalance: string,
  ) {
    const config = await this.customRepository.findOne({
      where: { config_id: configId },
    });
    if (!config) {
      // Handle config not found error
      return;
    }
    config.max_balance_mixin_bot = newMaxBalance;
    await this.customRepository.save(config);
  }

  async modifyMaxBalanceInAPIKey(configId: number = 0, newMaxBalance: string) {
    const config = await this.customRepository.findOne({
      where: { config_id: configId },
    });
    if (!config) {
      // Handle config not found error
      return;
    }
    config.max_balance_single_api_key = newMaxBalance;
    await this.customRepository.save(config);
  }

  async readFundingAccountStatus(configId: number = 0) {
    const config = await this.customRepository.findOne({
      where: { config_id: configId },
    });
    if (!config) {
      // Handle config not found error
      return;
    }
    return config.funding_account;
  }
}
