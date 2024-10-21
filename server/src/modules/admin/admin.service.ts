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

@Injectable()
export class AdminService {
  constructor(
    private readonly strategyService: StrategyService,
    private readonly performanceService: PerformanceService,
    private readonly exchangeInitService: ExchangeInitService,
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

  //   async getRunningStrategies() {
  //     return this.strategyService.getRunningStrategies();
  //   }

  //   async getStrategyPerformance(strategyKey: string) {
  //     return this.performanceService.getPerformanceByStrategy(strategyKey);
  //   }
}
