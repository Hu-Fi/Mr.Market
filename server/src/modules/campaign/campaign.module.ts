import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CampaignService } from './campaign.service';
import { Web3Module } from '../web3/web3.module';
import { ExchangeInitModule } from '../infrastructure/exchange-init/exchange-init.module';

@Module({
  imports: [Web3Module, ExchangeInitModule],
  providers: [CampaignService, ConfigService],
  exports: [CampaignService],
})
export class CampaignModule { }
