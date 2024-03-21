import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomConfigEntity } from 'src/common/entities/custom-config.entity';

@Injectable()
export class CustomConfigRepository {
  constructor(
    @InjectRepository(CustomConfigEntity)
    private readonly customRepository: Repository<CustomConfigEntity>,
  ) {}

  async readSpotFee(configId: number = 0) {
    const config = await this.customRepository.findOne({
      where: { config_id: configId },
    });
    if (!config) {
      // Handle config not found error
      return;
    }
    return config.spot_fee;
  }

  async modifySpotFee(newSpotFee: string, configId: number = 0) {
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
    newMaxBalance: string,
    configId: number = 0,
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

  async modifyMaxBalanceInAPIKey(newMaxBalance: string, configId: number = 0) {
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
