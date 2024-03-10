import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomConfigService {
  constructor() {}
  async modifySpotFee() {}
  async modifyMaxBalanceInMixinBot() {}
  async modifyMaxBalanceInAPIKey() {}
  async readFundingAccountStatus() {}
}
