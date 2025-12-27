import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MmCampaignService } from './mm-campaign.service';
import { CustomLogger } from 'src/modules/infrastructure/logger/logger.service';

@Processor('mm-campaigns')
export class MmCampaignProcessor {
  private readonly logger = new CustomLogger(MmCampaignProcessor.name);

  constructor(private readonly campaignService: MmCampaignService) {}

  @Process('check_campaign_status')
  async handleCheckCampaignStatus(job: Job<{ campaignId: string }>) {
    const { campaignId } = job.data;
    this.logger.log(`Checking campaign status for ${campaignId}`);

    const campaign = await this.campaignService.findById(campaignId);
    if (!campaign) {
      this.logger.error(`Campaign ${campaignId} not found`);
      return;
    }

    // Check if campaign has ended
    if (new Date() > campaign.endTime && campaign.status === 'active') {
      this.logger.log(`Campaign ${campaignId} ended. Distributing rewards...`);
      await this.campaignService.updateCampaign(campaignId, {
        status: 'completed',
      });

      // Trigger reward distribution
      await this.distributeRewards(campaignId);
    }
  }

  private async distributeRewards(campaignId: string) {
    const campaign = await this.campaignService.findById(campaignId);
    const participations = await this.campaignService.getParticipations(
      campaignId,
    );

    if (participations.length === 0) {
      this.logger.warn(`No participants for campaign ${campaignId}`);
      return;
    }

    const totalContribution = participations.reduce(
      (sum, p) => sum + Number(p.contributionAmount),
      0,
    );

    if (totalContribution === 0) {
      this.logger.warn(`Total contribution is 0 for campaign ${campaignId}`);
      return;
    }

    for (const p of participations) {
      const share = Number(p.contributionAmount) / totalContribution;
      const reward = share * Number(campaign.totalReward);

      await this.campaignService.updateParticipation(p.id, {
        rewardAmount: reward,
        status: 'rewarded',
      });

      this.logger.log(
        `Rewarded user ${p.userId} with ${reward} ${campaign.rewardToken}`,
      );
    }
  }
}
