import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CustomConfigService {
  constructor() {}

  async addAPIKey() {}
  async removeAPIKey() {}
  async pickAPIKeyOnDemand() {}
  async modifySpotFee() {}
  async modifyMaxBalanceInMixinBot() {}
  async modifyMaxBalanceInAPIKey() {}
  async readFundingAccountStatus() {}
}
