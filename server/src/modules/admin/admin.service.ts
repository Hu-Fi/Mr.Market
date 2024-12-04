import { Injectable, BadRequestException } from '@nestjs/common';
import { StrategyService } from '../strategy/strategy.service';
import { PerformanceService } from '../performance/performance.service';
import {
  GetDepositAddressDto,
  StartStrategyDto,
  StopStrategyDto,
} from './admin-strategy.dto';
import { ExchangeInitService } from '../exchangeInit/exchangeInit.service';
import {
  getInfoFromChainId,
  getTokenSymbolByContractAddress,
} from 'src/common/helpers/blockchain-utils';
import { InjectRepository } from '@nestjs/typeorm';
import { Contribution } from 'src/common/entities/contribution.entity';
import { Repository } from 'typeorm';
import { MixinUser } from 'src/common/entities/mixin-user.entity';
import { Web3Service } from '../web3/web3.service';
import { CustomLogger } from '../logger/logger.service';
import { SnapshotsService } from '../mixin/snapshots/snapshots.service';

@Injectable()
export class AdminService {
  private readonly logger = new CustomLogger(AdminService.name);
  constructor(
    private readonly strategyService: StrategyService,
    private readonly performanceService: PerformanceService,
    private readonly exchangeInitService: ExchangeInitService,
    private readonly snapshotsService: SnapshotsService,
    private readonly web3Service: Web3Service,
    @InjectRepository(Contribution)
    private contributionRepository: Repository<Contribution>,
    @InjectRepository(MixinUser)
    private mixinuserrepository: Repository<MixinUser>,
  ) {}

  async startStrategy(startStrategyDto: StartStrategyDto) {
    const { strategyType, arbitrageParams, marketMakingParams, volumeParams } =
      startStrategyDto;

    if (strategyType === 'arbitrage' && arbitrageParams) {
      return this.strategyService.startArbitrageStrategyForUser(
        arbitrageParams, // Only pass arbitrage parameters
        startStrategyDto.checkIntervalSeconds,
        startStrategyDto.maxOpenOrders,
      );
    } else if (strategyType === 'marketMaking' && marketMakingParams) {
      return this.strategyService.executePureMarketMakingStrategy(
        marketMakingParams, // Only pass market making parameters
      );
    } else if (strategyType === 'volume' && volumeParams) {
      return this.strategyService.executeVolumeStrategy(
        volumeParams.exchangeName,
        volumeParams.symbol,
        volumeParams.incrementPercentage,
        volumeParams.intervalTime,
        volumeParams.tradeAmount,
        volumeParams.numTrades,
        volumeParams.userId,
        volumeParams.clientId,
      );
    } else {
      throw new BadRequestException('Invalid strategy parameters');
    }
  }

  async stopStrategy(stopStrategyDto: StopStrategyDto) {
    const { strategyType, userId, clientId } = stopStrategyDto;
    return this.strategyService.stopStrategyForUser(
      userId,
      clientId,
      strategyType,
    );
  }
  async getDepositAddress(getDepositAddressDto: GetDepositAddressDto) {
    const { exchangeName, tokenSymbol, network, accountLabel } =
      getDepositAddressDto;
    const depositAddress = this.exchangeInitService.getDepositAddress(
      exchangeName,
      tokenSymbol,
      network,
      accountLabel,
    );
    return depositAddress;
  }

  async getSupportedNetworks(
    exchangeName: string,
    tokenSymbol: string,
    accountLabel: string,
  ) {
    const exchange = this.exchangeInitService.getExchange(
      exchangeName,
      accountLabel,
    );

    const currency = exchange.currencies[tokenSymbol];
    if (!currency) {
      throw new BadRequestException(
        `Token ${tokenSymbol} is not supported on ${exchangeName}.`,
      );
    }

    // Check if the exchange provides information about deposit networks
    const networks = currency.networks || [];

    // Map out the available deposit networks for the token
    const supportedNetworks = Object.keys(networks).map((network) => ({
      network,
      ...networks[network], // You can include additional details if needed
    }));

    if (supportedNetworks.length === 0) {
      throw new BadRequestException(
        `No deposit networks found for ${tokenSymbol} on ${exchangeName}.`,
      );
    }

    return supportedNetworks;
  }

  async getChainInfo(chainId: number): Promise<any> {
    try {
      // Call the utility function to get chain info from chainId
      const chainInfo = await getInfoFromChainId(chainId);
      return chainInfo;
    } catch (error) {
      throw new BadRequestException(
        `Failed to get chain info: ${error.message}`,
      );
    }
  }

  async joinStrategy(
    userId: string,
    clientId: string,
    strategyKey: string,
    amount: number,
    tokenSymbol: string,
    chainId: number,
    tokenAddress: string,
  ) {
    const strategy = await this.strategyService.getStrategyInstanceKey(
      strategyKey,
    );

    if (!strategy || strategy.status !== 'running') {
      throw new BadRequestException(`Strategy ${strategyKey} is not active`);
    }

    // Fetch the user entity
    const mixinUser = await this.mixinuserrepository.findOne({
      where: { user_id: userId },
    });
    if (!mixinUser) {
      throw new BadRequestException(`User ${userId} does not exist`);
    }

    let contribution;

    try {
      // Create a contribution record
      contribution = this.contributionRepository.create({
        userId,
        clientId,
        mixinUser,
        strategy,
        amount,
        transactionHash: null, // Initially null until the transfer is initiated
        status: 'pending', // Status remains pending until explicitly updated
        tokenSymbol,
        chainId,
        tokenAddress,
      });

      await this.contributionRepository.save(contribution);

      try {
        // Initiate transfer via SnapshotsService
        const transferResult = await this.snapshotsService.initiateUserTransfer(
          mixinUser.user_id, // Sender's Mixin user ID
          tokenSymbol, // Token to transfer
          amount, // Amount to transfer
        );

        // Update the contribution with the transaction hash
        const transactionHash = transferResult[0].request_id; // Extract Mixin transaction ID
        contribution.transactionHash = transactionHash;
        await this.contributionRepository.save(contribution);

        return {
          message: `User ${userId} has successfully initiated a transfer to join the strategy.`,
          contribution,
        };
      } catch (transferError) {
        this.logger.error(
          `Transfer failed for user ${userId}: ${transferError.message}`,
        );
        throw new BadRequestException(
          `Transfer failed: ${transferError.message}`,
        );
      }
    } catch (error) {
      this.logger.error(
        `Failed to create or process contribution for user ${userId}: ${error.message}`,
      );

      // Mark the contribution as failed if it was already created
      if (contribution) {
        contribution.status = 'failed';
        await this.contributionRepository.save(contribution);
      }

      throw new BadRequestException(
        `Failed to join strategy: ${error.message}`,
      );
    }
  }

  async verifyContribution(contributionId: string): Promise<boolean> {
    const contribution = await this.contributionRepository.findOne({
      where: { id: contributionId },
    });
    if (!contribution) {
      throw new BadRequestException(
        `Contribution ${contributionId} does not exist`,
      );
    }

    const { transactionHash, amount, userId, tokenSymbol } = contribution;

    if (!transactionHash) {
      throw new BadRequestException(
        `Contribution ${contributionId} does not have a transaction hash`,
      );
    }

    // Fetch the transaction details from Mixin
    const transaction = await this.snapshotsService.getTransactionById(
      transactionHash,
    );

    if (!transaction) {
      throw new BadRequestException(
        `Transaction ${transactionHash} does not exist on Mixin`,
      );
    }

    // Validate transaction details
    const isVerified =
      transaction.amount === amount.toString() &&
      transaction.asset.symbol.toUpperCase() === tokenSymbol.toUpperCase() &&
      transaction.user_id === userId;

    if (isVerified) {
      // Update the contribution status to confirmed
      contribution.status = 'confirmed';
      await this.contributionRepository.save(contribution);
      return true;
    }

    return false;
  }

  async getTokenSymbolByContract(
    contractAddress: string,
    chainId: number,
  ): Promise<string> {
    try {
      // Call the utility function to get token symbol by contract address and chain ID
      return await getTokenSymbolByContractAddress(contractAddress, chainId);
    } catch (error) {
      throw new BadRequestException(
        `Failed to get token symbol: ${error.message}`,
      );
    }
  }

  async getRunningStrategies() {
    return this.strategyService.getRunningStrategies();
  }

  //   async getStrategyPerformance(strategyKey: string) {
  //     return this.performanceService.getPerformanceByStrategy(strategyKey);
  //   }
}
