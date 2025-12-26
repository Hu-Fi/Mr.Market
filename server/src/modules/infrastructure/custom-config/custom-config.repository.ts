import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomConfigEntity } from 'src/common/entities/custom-config.entity';

@Injectable()
export class CustomConfigRepository {
  constructor(
    @InjectRepository(CustomConfigEntity)
    private readonly customRepository: Repository<CustomConfigEntity>,
  ) { }

  private async getConfigById(configId?: number): Promise<CustomConfigEntity> {
    let config: CustomConfigEntity | null;

    if (configId !== undefined) {
      // If configId is provided, fetch specific config
      config = await this.customRepository.findOne({
        where: { config_id: configId },
      });
      if (!config) {
        throw new Error(`Configuration with ID ${configId} not found.`);
      }
    } else {
      // If configId is not provided, fetch the first config
      const configs = await this.customRepository.find({
        order: { config_id: 'ASC' },
        take: 1,
      });
      config = configs[0] || null;
      if (!config) {
        throw new Error('No configuration found in database.');
      }
    }

    return config;
  }

  async readSpotFee(configId?: number) {
    const config = await this.getConfigById(configId);
    return config.spot_fee;
  }

  async modifySpotFee(newSpotFee: string, configId?: number) {
    const config = await this.getConfigById(configId);
    config.spot_fee = newSpotFee;
    await this.customRepository.save(config);
  }

  async modifyMaxBalanceInMixinBot(
    newMaxBalance: string,
    configId?: number,
  ) {
    const config = await this.getConfigById(configId);
    config.max_balance_mixin_bot = newMaxBalance;
    await this.customRepository.save(config);
  }

  async modifyMaxBalanceInAPIKey(newMaxBalance: string, configId?: number) {
    const config = await this.getConfigById(configId);
    config.max_balance_single_api_key = newMaxBalance;
    await this.customRepository.save(config);
  }

  async readFundingAccountStatus(configId?: number) {
    const config = await this.getConfigById(configId);
    return config.funding_account;
  }

  async readMarketMakingFee(configId?: number) {
    const config = await this.getConfigById(configId);
    return config.market_making_fee;
  }
}
