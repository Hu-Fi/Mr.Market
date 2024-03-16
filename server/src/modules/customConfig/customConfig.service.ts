import { Injectable } from '@nestjs/common';
import { CustomConfigRepository } from 'src/modules/customConfig/customConfig.repository';

@Injectable()
export class CustomConfigService {
  constructor(
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
