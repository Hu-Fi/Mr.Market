import { Injectable, BadRequestException } from '@nestjs/common';
import { StrategyService } from '../strategy/strategy.service';
import { PerformanceService } from '../performance/performance.service';
import {
  GetDepositAddressDto,
  StartStrategyDto,
  StopStrategyDto,
} from './admin-strategy.dto';
import { ExchangeInitService } from '../exchangeInit/exchangeInit.service';

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
    return this.exchangeInitService.getDepositAddress(
      exchangeName,
      tokenSymbol,
      network,
      accountLabel,
    );
  }

  //   async getRunningStrategies() {
  //     return this.strategyService.getRunningStrategies();
  //   }

  //   async getStrategyPerformance(strategyKey: string) {
  //     return this.performanceService.getPerformanceByStrategy(strategyKey);
  //   }
}
