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
  async modifySpotFee() {}
  async modifyMaxBalanceInMixinBot() {}
  async modifyMaxBalanceInAPIKey() {}
  async readFundingAccountStatus() {}
}
