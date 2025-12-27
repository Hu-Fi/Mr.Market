import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { MmCampaignService } from './mm-campaign.service';
import { MmCampaignController } from './mm-campaign.controller';
import { Campaign } from 'src/common/entities/campaign.entity';
import { CampaignParticipation } from 'src/common/entities/campaign-participation.entity';
import { MmCampaignProcessor } from './mm-campaign.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Campaign, CampaignParticipation]),
    BullModule.registerQueue({
      name: 'mm-campaigns',
    }),
  ],
  controllers: [MmCampaignController],
  providers: [MmCampaignService, MmCampaignProcessor],
  exports: [MmCampaignService],
})
export class MmCampaignModule {}
