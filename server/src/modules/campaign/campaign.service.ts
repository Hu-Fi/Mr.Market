import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CampaignDataDto } from './campaign.dto';
import axios, { AxiosInstance } from 'axios';
import { CustomLogger } from '../logger/logger.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Web3Service } from '../web3/web3.service';
import { ExchangeInitService } from '../exchangeInit/exchangeInit.service';

@Injectable()
export class CampaignService {
  private readonly logger = new CustomLogger(CampaignService.name);

  private readonly hufiCampaignLauncherAPI: AxiosInstance;
  private readonly hufiRecordingOracleAPI: AxiosInstance;

  constructor(
    private readonly configService: ConfigService,
    private readonly web3Service: Web3Service,
    private readonly exchangeService: ExchangeInitService,
  ) {
    this.hufiCampaignLauncherAPI = axios.create({
      baseURL: this.configService.get<string>('hufi.campaign_launcher.api_url'),
    });

    this.hufiRecordingOracleAPI = axios.create({
      baseURL: this.configService.get<string>('hufi.recording_oracle.api_url'),
      headers: {
        'x-api-key': this.configService.get<string>(
          'hufi.recording_oracle.api_key',
        ),
      },
    });
  }

  async getCampaigns() {
    this.logger.debug('Getting HuFi campaigns');

    try {
      const { data } = await this.hufiCampaignLauncherAPI.get<
        CampaignDataDto[]
      >('/campaign?chainId=-1');

      this.logger.debug('Finished getting HuFi campaigns');
      return data;
    } catch (error) {
      this.logger.error('Error getting HuFi campaigns', error);
      return [];
    }
  }

  /**
   * Every hour, check if there are any new campaigns to join
   */
  @Cron(CronExpression.EVERY_HOUR)
  async joinCampaigns() {
    const campaigns = await this.getCampaigns();

    this.logger.debug('Getting running campaigns');
    const runningCampaigns = campaigns.filter((campaign) => {
      return (
        campaign.status !== 'Complete' &&
        new Date(campaign.endBlock * 1000) >= new Date()
      );
    });

    if (runningCampaigns.length === 0) {
      this.logger.debug('No campaigns to join');
      return;
    }

    this.logger.log(`Joining ${runningCampaigns.length} campaigns`);

    for (const campaign of runningCampaigns) {
      try {
        const walletAddress = await this.web3Service
          .getSigner(campaign.chainId)
          .getAddress();

        const { data: joined } = await this.hufiRecordingOracleAPI.get(
          `/mr-market/campaign?chainId=${campaign.chainId}&address=${campaign.address}&walletAddress=${walletAddress}`,
        );

        if (joined) {
          this.logger.debug('Already joined campaign');
          continue;
        }

        const exchangeInstance = await this.exchangeService.getExchange(
          campaign.exchangeName,
          'read-only',
        );

        await this.hufiRecordingOracleAPI.post('/mr-market/campaign', {
          wallet_address: walletAddress,
          chain_id: campaign.chainId,
          address: campaign.address,
          exchange_name: campaign.exchangeName,
          api_key: exchangeInstance.apiKey,
          secret: exchangeInstance.secret,
        });
      } catch (e) {
        this.logger.error('Error joining campaign: ', e);
      }
    }
  }
}
