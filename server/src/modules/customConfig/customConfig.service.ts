import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomConfigRepository } from './customConfig.repository';

@Injectable()
export class CustomConfigService {
  constructor(
    @InjectRepository(CustomConfigRepository)
    private configRepository: CustomConfigRepository,
  ) {}
  async readSpotFee() {
    return await this.configRepository.readSpotFee();
  }
  async modifySpotFee(newSpotFee: string) {
    return await this.configRepository.modifySpotFee(newSpotFee);
  }
  async modifyMaxBalanceInMixinBot(newMaxBalance: string) {
    return await this.configRepository.modifyMaxBalanceInMixinBot(
      newMaxBalance,
    );
  }
  async modifyMaxBalanceInAPIKey(newMaxBalance: string) {
    return await this.configRepository.modifyMaxBalanceInAPIKey(newMaxBalance);
  }
  async readFundingAccountStatus() {
    return await this.configRepository.readFundingAccountStatus();
  }
}
