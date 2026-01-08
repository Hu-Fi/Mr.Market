import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { LocalCampaignService } from './local-campaign.service';
import { Campaign } from 'src/common/entities/campaign.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Campaigns')
@Controller('local-campaigns')
export class LocalCampaignController {
  constructor(private readonly campaignService: LocalCampaignService) { }

  @Post()
  async createCampaign(@Body() data: Partial<Campaign>) {
    return this.campaignService.createCampaign(data);
  }

  @Get(':id')
  async getCampaign(@Param('id') id: string) {
    return this.campaignService.findById(id);
  }
}
