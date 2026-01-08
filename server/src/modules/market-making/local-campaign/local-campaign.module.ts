import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { LocalCampaignService } from './local-campaign.service';
import { LocalCampaignController } from './local-campaign.controller';
import { Campaign } from 'src/common/entities/campaign.entity';
import { CampaignParticipation } from 'src/common/entities/campaign-participation.entity';
import { LocalCampaignProcessor } from './local-campaign.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Campaign, CampaignParticipation]),
    BullModule.registerQueue({
      name: 'local-campaigns',
    }),
  ],
  controllers: [LocalCampaignController],
  providers: [LocalCampaignService, LocalCampaignProcessor],
  exports: [LocalCampaignService],
})
export class LocalCampaignModule { }
