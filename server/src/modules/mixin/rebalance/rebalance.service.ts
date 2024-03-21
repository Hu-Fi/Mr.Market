import { Cron } from '@nestjs/schedule';
import { Injectable, Logger } from '@nestjs/common';
import { CustomConfigService } from 'src/modules/customConfig/customConfig.service';

@Injectable()
export class RebalanceService {
  private readonly logger = new Logger(RebalanceService.name);

  constructor(private customConfigService: CustomConfigService) {}

  @Cron('* * * * *')
  async CheckRebalance() {
    // Rebalance when balance amount is larger than xxx
    // Rebalance when amount gap is larger than
    // Check balance in mixin
    // Check balance in api keys
  }
}
