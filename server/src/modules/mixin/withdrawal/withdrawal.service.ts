import { Injectable, Logger } from '@nestjs/common';
import { getBigOneFeeByID } from './sources/bigone';
import { getMixinSafeFeeByID } from './sources/mixinSafe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WithdrawalService {
  private readonly logger = new Logger(WithdrawalService.name);

  constructor(private configService: ConfigService) {}

  async getBestFeeByAssetID(asset_id: string) {
    const bigoneFee = await getBigOneFeeByID(asset_id);
    const mixinFee = await getMixinSafeFeeByID(asset_id);

    if (mixinFee <= bigoneFee) {
      return {
        id: asset_id,
        source: 'MixinSafe',
        fee: mixinFee,
      };
    }
    return {
      id: asset_id,
      source: 'BigOne',
      fee: bigoneFee,
    };
  }
}
