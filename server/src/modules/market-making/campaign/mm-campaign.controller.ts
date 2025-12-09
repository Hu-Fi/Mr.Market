import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MmCampaignService } from './mm-campaign.service';
import { Campaign } from 'src/common/entities/campaign.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Campaigns')
@Controller('mm-campaigns')
export class MmCampaignController {
  constructor(private readonly campaignService: MmCampaignService) { }

  @Post()
  async createCampaign(@Body() data: Partial<Campaign>) {
    return this.campaignService.createCampaign(data);
  }

  @Get(':id')
  async getCampaign(@Param('id') id: string) {
    return this.campaignService.findById(id);
  }
}
