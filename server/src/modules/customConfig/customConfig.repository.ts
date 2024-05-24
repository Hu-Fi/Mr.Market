import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomConfigEntity } from '../../common/entities/custom-config.entity';

@Injectable()
export class CustomConfigRepository {
  constructor(
    @InjectRepository(CustomConfigEntity)
    private readonly customRepository: Repository<CustomConfigEntity>,
  ) {}

  private async getConfigById(configId: number): Promise<CustomConfigEntity> {
    const config = await this.customRepository.findOne({
      where: { config_id: configId },
    });
    if (!config) {
      // handle config not found error
      throw new Error(`Configuration with ID ${configId} not found.`);
    }
    return config;
  }

  async readSpotFee(configId: number = 0) {
    const config = await this.getConfigById(configId);
    return config.spot_fee;
  }

  async modifySpotFee(newSpotFee: string, configId: number = 0) {
    const config = await this.getConfigById(configId);
    config.spot_fee = newSpotFee;
    await this.customRepository.save(config);
  }

  async modifyMaxBalanceInMixinBot(
    newMaxBalance: string,
    configId: number = 0,
  ) {
    const config = await this.getConfigById(configId);
    config.max_balance_mixin_bot = newMaxBalance;
    await this.customRepository.save(config);
  }

  async modifyMaxBalanceInAPIKey(newMaxBalance: string, configId: number = 0) {
    const config = await this.getConfigById(configId);
    config.max_balance_single_api_key = newMaxBalance;
    await this.customRepository.save(config);
  }

  async readFundingAccountStatus(configId: number = 0) {
    const config = await this.getConfigById(configId);
    return config.funding_account;
  }
}
