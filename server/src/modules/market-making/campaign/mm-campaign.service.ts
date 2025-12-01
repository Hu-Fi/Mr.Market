import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Campaign } from 'src/common/entities/campaign.entity';
import { CampaignParticipation } from 'src/common/entities/campaign-participation.entity';
import { CustomLogger } from 'src/modules/infrastructure/logger/logger.service';

@Injectable()
export class MmCampaignService {
  private readonly logger = new CustomLogger(MmCampaignService.name);

  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
    @InjectRepository(CampaignParticipation)
    private readonly participationRepository: Repository<CampaignParticipation>,
    @InjectQueue('mm-campaigns') private readonly campaignQueue: Queue,
  ) { }

  async createCampaign(data: Partial<Campaign>): Promise<Campaign> {
    const campaign = this.campaignRepository.create({
      ...data,
      status: 'active',
    });
    return this.campaignRepository.save(campaign);
  }

  async joinCampaign(userId: string, campaignId: string, orderId?: string): Promise<CampaignParticipation> {
    const participation = this.participationRepository.create({
      userId,
      campaignId,
      orderId,
      status: 'joined',
    });
    return this.participationRepository.save(participation);
  }

  async monitorCampaigns() {
    const activeCampaigns = await this.campaignRepository.find({
      where: { status: 'active' },
    });

    for (const campaign of activeCampaigns) {
      await this.campaignQueue.add('check_campaign_status', {
        campaignId: campaign.id,
      });
    }
  }

  async findById(id: string): Promise<Campaign> {
    return this.campaignRepository.findOneBy({ id });
  }

  async updateCampaign(id: string, update: Partial<Campaign>) {
    await this.campaignRepository.update(id, update);
  }

  async getParticipations(campaignId: string): Promise<CampaignParticipation[]> {
    return this.participationRepository.find({ where: { campaignId } });
  }

  async updateParticipation(id: string, update: Partial<CampaignParticipation>) {
    await this.participationRepository.update(id, update);
  }
}
