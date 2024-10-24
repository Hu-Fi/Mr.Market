import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CampaignService } from './campaign.service';
import { HttpModule } from '@nestjs/axios';
import { Web3Module } from '../web3/web3.module';
import { ExchangeInitModule } from '../exchangeInit/exchangeInit.module';

@Module({
  imports: [HttpModule, Web3Module, ExchangeInitModule],
  providers: [CampaignService, ConfigService],
  exports: [CampaignService],
})
export class CampaignModule {}
