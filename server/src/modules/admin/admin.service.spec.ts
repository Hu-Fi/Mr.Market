import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { StrategyService } from '../strategy/strategy.service';
import { PerformanceService } from '../performance/performance.service';
import { BadRequestException } from '@nestjs/common';
import {
  StartStrategyDto,
  StopStrategyDto,
  GetDepositAddressDto,
} from './admin-strategy.dto';
import { PriceSourceType } from 'src/common/enum/pricesourcetype';
import { ExchangeInitService } from '../exchangeInit/exchangeInit.service';
import { Web3Service } from '../web3/web3.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Contribution } from 'src/common/entities/contribution.entity';
import { MixinUser } from 'src/common/entities/mixin-user.entity';
import { SnapshotsService } from '../mixin/snapshots/snapshots.service';

describe('AdminService', () => {
  let service: AdminService;
  let strategyService: StrategyService;
  let snapshotsService: jest.Mocked<SnapshotsService>;

  const mockContributionRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  const mockSnapshotsService = {
    sendMixinTx: jest
      .fn()
      .mockResolvedValue([{ request_id: 'transaction123', status: 'success' }]),
    getTransactionById: jest.fn().mockResolvedValue({
      amount: '100',
      asset: { symbol: 'ETH' },
      user_id: 'user123',
    }),
    initiateUserTransfer: jest
      .fn()
      .mockResolvedValue([{ request_id: 'transaction123', status: 'success' }]),
  };

  const mockMixinUserRepository = {
    findOne: jest.fn(),
  };

  const mockExchangeInitService = {
    getDepositAddress: jest.fn(),
    getExchange: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: StrategyService,
          useValue: {
            startArbitrageStrategyForUser: jest.fn(),
            executePureMarketMakingStrategy: jest.fn(),
            executeVolumeStrategy: jest.fn(),
            stopStrategyForUser: jest.fn(),
            getStrategyInstanceKey: jest
              .fn()
              .mockResolvedValue({ status: 'running' }),
          },
        },
        {
          provide: PerformanceService,
          useValue: {
            get: jest.fn(), // Mock the method directly here
          },
        },
        {
          provide: Web3Service,
          useValue: {
            verifyTransactionDetails: jest.fn(), // Mock the method directly here
          },
        },
        {
          provide: SnapshotsService,
          useValue: mockSnapshotsService,
        },
        {
          provide: getRepositoryToken(Contribution),
          useValue: mockContributionRepository,
        },
        {
          provide: getRepositoryToken(MixinUser),
          useValue: mockMixinUserRepository,
        },
        {
          provide: ExchangeInitService,
          useValue: mockExchangeInitService,
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    strategyService = module.get<StrategyService>(StrategyService);
    snapshotsService = module.get(
      SnapshotsService,
    ) as jest.Mocked<SnapshotsService>;
  });

  describe('startStrategy', () => {
    it('should start an arbitrage strategy', async () => {
      const startStrategyDto: StartStrategyDto = {
        strategyType: 'arbitrage',
        arbitrageParams: {
          userId: 'user123',
          clientId: 'client123',
          pair: 'ETH/USDT',
          amountToTrade: 1.0,
          minProfitability: 0.01,
          exchangeAName: 'binance',
          exchangeBName: 'mexc',
          checkIntervalSeconds: 10,
          maxOpenOrders: 5,
        },
        checkIntervalSeconds: 10,
        maxOpenOrders: 5,
      };

      await service.startStrategy(startStrategyDto);

      expect(
        strategyService.startArbitrageStrategyForUser,
      ).toHaveBeenCalledWith(
        startStrategyDto.arbitrageParams,
        startStrategyDto.checkIntervalSeconds,
        startStrategyDto.maxOpenOrders,
      );
    });

    it('should start a market making strategy', async () => {
      const startStrategyDto: StartStrategyDto = {
        strategyType: 'marketMaking',
        marketMakingParams: {
          userId: 'user123',
          clientId: 'client123',
          pair: 'BTC/USD',
          exchangeName: 'binance',
          bidSpread: 0.1,
          askSpread: 0.1,
          orderAmount: 0.1,
          orderRefreshTime: 15000,
          numberOfLayers: 1,
          priceSourceType: PriceSourceType.MID_PRICE,
          amountChangePerLayer: 1,
          amountChangeType: 'percentage',
        },
      };

      await service.startStrategy(startStrategyDto);

      expect(
        strategyService.executePureMarketMakingStrategy,
      ).toHaveBeenCalledWith(startStrategyDto.marketMakingParams);
    });

    it('should start a volume strategy', async () => {
      const startStrategyDto: StartStrategyDto = {
        strategyType: 'volume',
        volumeParams: {
          exchangeName: 'Binance',
          symbol: 'BTCUSDT',
          incrementPercentage: 0.1,
          intervalTime: 60,
          tradeAmount: 100,
          numTrades: 5,
          userId: 'user123',
          clientId: 'client123',
        },
      };

      await service.startStrategy(startStrategyDto);

      expect(strategyService.executeVolumeStrategy).toHaveBeenCalledWith(
        startStrategyDto.volumeParams.exchangeName,
        startStrategyDto.volumeParams.symbol,
        startStrategyDto.volumeParams.incrementPercentage,
        startStrategyDto.volumeParams.intervalTime,
        startStrategyDto.volumeParams.tradeAmount,
        startStrategyDto.volumeParams.numTrades,
        startStrategyDto.volumeParams.userId,
        startStrategyDto.volumeParams.clientId,
      );
    });

    it('should throw BadRequestException for invalid strategy parameters', async () => {
      const startStrategyDto: StartStrategyDto = {
        strategyType: 'arbitrage', // No arbitrageParams provided
      };

      await expect(service.startStrategy(startStrategyDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('stopStrategy', () => {
    it('should stop a strategy', async () => {
      const stopStrategyDto: StopStrategyDto = {
        strategyType: 'arbitrage',
        userId: 'user123',
        clientId: 'client123',
      };

      await service.stopStrategy(stopStrategyDto);

      expect(strategyService.stopStrategyForUser).toHaveBeenCalledWith(
        stopStrategyDto.userId,
        stopStrategyDto.clientId,
        stopStrategyDto.strategyType,
      );
    });
  });

  describe('joinStrategy', () => {
    it('should create a contribution and save it', async () => {
      const joinData = {
        userId: 'user123',
        clientId: 'client123',
        strategyKey: 'strategyKey',
        amount: 100,
        tokenSymbol: 'ETH',
        chainId: 1,
        tokenAddress: '0xabc',
      };

      mockMixinUserRepository.findOne.mockResolvedValue({ user_id: 'user123' });
      mockContributionRepository.create.mockReturnValue(joinData);
      mockContributionRepository.save.mockResolvedValue(joinData);
      mockSnapshotsService.initiateUserTransfer.mockResolvedValue([
        { request_id: 'transaction123' },
      ]);

      const result = await service.joinStrategy(
        joinData.userId,
        joinData.clientId,
        joinData.strategyKey,
        joinData.amount,
        joinData.tokenSymbol,
        joinData.chainId,
        joinData.tokenAddress,
      );

      expect(result).toEqual({
        message: `User ${joinData.userId} has successfully initiated a transfer to join the strategy.`,
        contribution: expect.objectContaining({
          userId: joinData.userId,
          transactionHash: 'transaction123',
        }),
      });
      expect(mockContributionRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          transactionHash: 'transaction123',
        }),
      );
    });
  });

  describe('verifyContribution', () => {
    it('should confirm and update contribution if verified', async () => {
      const contribution = {
        id: '1',
        transactionHash: 'transaction123',
        amount: 100,
        userId: 'user123',
        tokenSymbol: 'ETH',
        status: 'pending',
      };

      const transaction = {
        amount: '100',
        asset: { symbol: 'ETH' },
        user_id: 'user123',
      };

      mockContributionRepository.findOne.mockResolvedValue(contribution);
      mockSnapshotsService.getTransactionById.mockResolvedValue(transaction);

      const result = await service.verifyContribution(contribution.id);

      expect(result).toBe(true);
      expect(mockContributionRepository.save).toHaveBeenCalledWith({
        ...contribution,
        status: 'confirmed',
      });
    });

    it('should not update contribution if verification fails', async () => {
      const contribution = {
        id: '1',
        transactionHash: 'transaction123',
        amount: 100,
        userId: 'user123',
        tokenSymbol: 'ETH',
        status: 'pending',
      };

      const transaction = {
        amount: '50', // Mismatch amount
        asset: { symbol: 'BTC' }, // Mismatch token
        user_id: 'user123',
      };

      mockContributionRepository.findOne.mockResolvedValue(contribution);
      snapshotsService.getTransactionById.mockResolvedValue(transaction);

      const result = await service.verifyContribution(contribution.id);

      expect(result).toBe(false);
      expect(mockContributionRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('getDepositAddress', () => {
    it('should return the deposit address', async () => {
      const getDepositAddressDto: GetDepositAddressDto = {
        exchangeName: 'binance',
        tokenSymbol: 'USDT',
        network: 'eth',
        accountLabel: 'default',
      };

      mockExchangeInitService.getDepositAddress.mockResolvedValue('0xabc');

      const result = await service.getDepositAddress(getDepositAddressDto);

      expect(result).toBe('0xabc');
    });
  });

  describe('getSupportedNetworks', () => {
    it('should return supported networks for a token', async () => {
      const getSupportedNetworksDto = {
        exchangeName: 'binance',
        tokenSymbol: 'USDT',
        accountLabel: 'default',
      };

      const exchangeMock = {
        currencies: {
          USDT: { networks: { eth: {}, bsc: {} } },
        },
      };

      mockExchangeInitService.getExchange.mockReturnValue(exchangeMock);

      const result = await service.getSupportedNetworks(
        getSupportedNetworksDto.exchangeName,
        getSupportedNetworksDto.tokenSymbol,
        getSupportedNetworksDto.accountLabel,
      );

      expect(result).toEqual([{ network: 'eth' }, { network: 'bsc' }]);
    });
  });

  describe('getChainInfo', () => {
    it('should return chain info', async () => {
      const chainInfoMock = { name: 'Ethereum', chainId: 1 };
      jest.spyOn(service, 'getChainInfo').mockResolvedValue(chainInfoMock);

      const result = await service.getChainInfo(1);

      expect(result).toEqual(chainInfoMock);
    });
  });

  describe('getTokenSymbolByContract', () => {
    it('should return token symbol by contract address and chain ID', async () => {
      jest.spyOn(service, 'getTokenSymbolByContract').mockResolvedValue('USDT');

      const result = await service.getTokenSymbolByContract('0xabc', 1);

      expect(result).toBe('USDT');
    });
  });
});
