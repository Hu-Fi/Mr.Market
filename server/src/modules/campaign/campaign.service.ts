import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CampaignDataDto } from './campaign.dto';
import axios, { AxiosInstance } from 'axios';
import { CustomLogger } from '../infrastructure/logger/logger.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Web3Service } from '../web3/web3.service';
import { ExchangeInitService } from '../infrastructure/exchange-init/exchange-init.service';

@Injectable()
export class CampaignService {
  private readonly logger = new CustomLogger(CampaignService.name);

  private readonly campaignLauncherBaseUrl: string;
  private readonly recordingOracleBaseUrl: string;
  private readonly hufiCampaignLauncherAPI: AxiosInstance;
  private readonly hufiRecordingOracleAPI: AxiosInstance;

  constructor(
    private readonly configService: ConfigService,
    private readonly web3Service: Web3Service,
    private readonly exchangeService: ExchangeInitService,
  ) {
    this.campaignLauncherBaseUrl = this.configService.get<string>(
      'hufi.campaign_launcher.api_url',
    );
    this.recordingOracleBaseUrl = this.configService.get<string>(
      'hufi.recording_oracle.api_url',
    );

    this.hufiCampaignLauncherAPI = axios.create({
      baseURL: this.campaignLauncherBaseUrl,
    });

    this.hufiRecordingOracleAPI = axios.create({
      baseURL: this.recordingOracleBaseUrl,
    });
  }

  async getCampaigns() {
    this.logger.log('Getting HuFi campaigns');

    try {
      const { data } = await this.hufiCampaignLauncherAPI.get<
        CampaignDataDto[]
      >('/campaign?chainId=-1');

      this.logger.log('Finished getting HuFi campaigns');
      return data;
    } catch (error) {
      this.logger.error('Error getting HuFi campaigns', error.message);
      return [];
    }
  }

  /**
   * Function 1: Get Authentication Nonce
   * Retrieve a unique, server-generated nonce string required for Web3 message signing.
   *
   * @param wallet_address - The user's Ethereum wallet address
   * @returns The unique nonce string returned by the API
   * @throws Error if the API request fails
   */
  async get_auth_nonce(wallet_address: string): Promise<string> {
    this.logger.log(
      `Getting authentication nonce for wallet: ${wallet_address}`,
    );

    try {
      const { data } = await this.hufiRecordingOracleAPI.post<{
        nonce: string;
      }>('/auth/nonce', {
        address: wallet_address,
      });

      this.logger.log('Successfully retrieved authentication nonce');
      return data.nonce;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Unknown error occurred';
      this.logger.error(
        `Error getting authentication nonce: ${errorMessage}`,
        error.stack,
      );
      throw new Error(
        `Failed to get authentication nonce: ${errorMessage}`,
      );
    }
  }

  /**
   * Function 2: Web3 Authentication
   * Authenticate the user by verifying a signed message and obtaining an access token.
   *
   * @param wallet_address - The user's Ethereum wallet address
   * @param nonce - The nonce obtained from get_auth_nonce
   * @param private_key - The user's private key (for local signing)
   * @returns The JWT access token returned by the API
   * @throws Error if authentication fails
   */
  async authenticate_web3_user(
    wallet_address: string,
    nonce: string,
    private_key: string,
  ): Promise<string> {
    this.logger.log(`Authenticating Web3 user: ${wallet_address}`);

    try {
      // Create a wallet instance from the private key to sign the nonce
      const { Wallet } = await import('ethers');
      const wallet = new Wallet(private_key);

      // Sign the nonce using EIP-191 message signing convention
      // signMessage automatically prepends "\x19Ethereum Signed Message:\n" + message.length
      const signature = await wallet.signMessage(nonce);

      this.logger.log('Nonce signed successfully, requesting access token');

      // Send the signed message to the API for verification
      const { data } = await this.hufiRecordingOracleAPI.post<{
        access_token: string;
      }>('/auth', {
        address: wallet_address,
        signature: signature,
      });

      this.logger.log('Successfully authenticated Web3 user');
      return data.access_token;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Unknown error occurred';
      this.logger.error(
        `Error authenticating Web3 user: ${errorMessage}`,
        error.stack,
      );
      throw new Error(`Failed to authenticate Web3 user: ${errorMessage}`);
    }
  }

  /**
   * Function 3: Join Campaign
   * Enroll the authenticated user into a specific HuFi campaign.
   *
   * @param access_token - The token obtained from authenticate_web3_user
   * @param chain_id - The blockchain network ID of the campaign
   * @param campaign_address - The contract address of the campaign
   * @returns Success message or the full API response object
   * @throws Error if enrollment fails
   */
  async join_campaign(
    access_token: string,
    chain_id: number,
    campaign_address: string,
  ): Promise<any> {
    this.logger.log(
      `Joining campaign: ${campaign_address} on chain: ${chain_id}`,
    );

    try {
      const { data } = await this.hufiRecordingOracleAPI.post(
        '/campaigns/join',
        {
          chain_id: chain_id,
          address: campaign_address,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      );

      this.logger.log(
        `Successfully joined campaign: ${campaign_address} on chain: ${chain_id}`,
      );
      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Unknown error occurred';

      // Provide more specific error messages based on status codes
      if (error.response?.status === 403) {
        this.logger.error('Invalid or expired access token');
        throw new Error('Invalid or expired access token');
      } else if (error.response?.status === 400) {
        this.logger.error(
          `Invalid campaign details or already joined: ${errorMessage}`,
        );
        throw new Error(
          `Invalid campaign details or already joined: ${errorMessage}`,
        );
      }

      this.logger.error(
        `Error joining campaign: ${errorMessage}`,
        error.stack,
      );
      throw new Error(`Failed to join campaign: ${errorMessage}`);
    }
  }

  /**
   * Helper method: Complete Campaign Join Flow
   * Orchestrates the complete flow to join a campaign by chaining the three functions:
   * 1. Get authentication nonce
   * 2. Authenticate with Web3 signature
   * 3. Join the campaign
   *
   * @param wallet_address - The user's Ethereum wallet address
   * @param private_key - The user's private key for signing
   * @param chain_id - The blockchain network ID of the campaign
   * @param campaign_address - The contract address of the campaign
   * @returns The API response from successfully joining the campaign
   * @throws Error if any step in the process fails
   */
  async joinCampaignWithAuth(
    wallet_address: string,
    private_key: string,
    chain_id: number,
    campaign_address: string,
  ): Promise<any> {
    this.logger.log(
      `Starting complete campaign join flow for wallet: ${wallet_address}`,
    );

    try {
      // Step 1: Get authentication nonce
      const nonce = await this.get_auth_nonce(wallet_address);

      // Step 2: Authenticate and get access token
      const access_token = await this.authenticate_web3_user(
        wallet_address,
        nonce,
        private_key,
      );

      // Step 3: Join the campaign using the access token
      const result = await this.join_campaign(
        access_token,
        chain_id,
        campaign_address,
      );

      this.logger.log(
        `Successfully completed campaign join flow for campaign: ${campaign_address}`,
      );

      return result;
    } catch (error) {
      this.logger.error(
        `Failed to complete campaign join flow: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Every hour, check if there are any new campaigns to join
   */
  @Cron(CronExpression.EVERY_HOUR)
  async joinCampaigns() {
    if (!this.campaignLauncherBaseUrl) {
      this.logger.warn(
        'Missing HuFi campaign launcher API base URL. Join campaign cron will not run.',
      );
      return;
    }
    if (!this.recordingOracleBaseUrl) {
      this.logger.warn(
        'Missing HuFi recording oracle API base URL. Join campaign cron will not run.',
      );
      return;
    }
    const campaigns = await this.getCampaigns();

    this.logger.log('Getting running campaigns');
    const runningCampaigns = campaigns.filter((campaign) => {
      return (
        campaign.status !== 'Complete' &&
        new Date(campaign.endBlock * 1000) >= new Date()
      );
    });

    if (runningCampaigns.length === 0) {
      this.logger.log('No campaigns to join');
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
          this.logger.log('Already joined campaign');
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

        this.logger.log(
          `Joined Hu-Fi campaign:\n\tChainId: ${campaign.chainId}\n\tAddress: ${campaign.address}\n\tExchange: ${campaign.exchangeName}`,
        );
      } catch (e) {
        this.logger.error('Error joining campaign: ', e.message);
      }
    }
  }
}
