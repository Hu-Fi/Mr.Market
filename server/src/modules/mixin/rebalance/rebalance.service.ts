import { Cron } from '@nestjs/schedule';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RebalanceService {
  private readonly logger = new Logger(RebalanceService.name);

  constructor() {}

  @Cron('* * * * *')
  async CheckRebalance() {
    // Check balance in mixin
    // Check balance in api keys
  }
}
