import { Injectable, Logger } from '@nestjs/common';
import { BigoneService } from './bigone/bigone.service';

@Injectable()
export class RebalanceService {
  private readonly logger = new Logger(RebalanceService.name);

  constructor(private bigoneService: BigoneService) {}

  // Bigone Withdrawal
  // Bigone GetFee
  // Bigone Balance
  // Bigone Transfer from mixin to bigone
  // const FEE_BASE_URL = 'https://bigone.com';
  // const x = `${FEE_BASE_URL}/api/uc/v2/me/mixin/transfer_in`
  // const r = {"binding_asset_guid":"e9986640-ced3-4f17-be9d-3c6016d12c76","amount":"0.001","target_account":"FUNDING"};
}
