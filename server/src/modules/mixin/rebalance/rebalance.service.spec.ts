import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeService } from 'src/modules/mixin/exchange/exchange.service';
import { SnapshotsService } from 'src/modules/mixin/snapshots/snapshots.service';
import { RebalanceRepository } from 'src/modules/mixin/rebalance/rebalance.repository';
import { RebalanceService } from './rebalance.service';

describe.skip('getBestFeeByAssetID', () => {
  let service: RebalanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RebalanceService, ConfigService],
    }).compile();

    service = module.get<RebalanceService>(RebalanceService);
  });

  it('hello', () => {
    console.log('hello');
    service.rebalance();
  });
});

describe('Rebalancing from exchange to mixin', () => {
  let service: RebalanceService;
  let exchangeServiceMock: Partial<ExchangeService>;
  let snapshotsServiceMock: Partial<SnapshotsService>;
  let rebalanceRepositoryMock: Partial<RebalanceRepository>;

  beforeEach(async () => {
    exchangeServiceMock = {
      getAllAPIKeysBalance: jest.fn().mockResolvedValue({
        exchange1: {
          apiKeyBalances: [
            { api_key_id: 'key1', balances: { BTC: '0.5' } },
            { api_key_id: 'key2', balances: { BTC: '0.4' } },
          ],
        },
      }),
      aggregateBalancesByExchange: jest.fn().mockReturnValue({
        exchange1: {
          total: { BTC: '1' },
          apiKeyBalances: [
            {
              balances: {
                BTC: '10',
              },
            },
          ],
        },
        exchange2: {
          total: { BTC: '1' },
          apiKeyBalances: [
            {
              balances: {
                BTC: '2',
              },
            },
          ],
        },
      }),
      createWithdrawal: jest.fn(),
      findFirstAPIKeyByExchange: jest
        .fn()
        .mockResolvedValue({ key_id: 'key1' }),
      getDepositAddress: jest.fn().mockResolvedValue({
        address: 'mixinDepositAddress',
        memo: 'mixinMemo',
      }),
    };
    snapshotsServiceMock = {
      getAllAssetBalances: jest.fn().mockResolvedValue({
        'c6d0c728-2624-429b-8e0d-d9d19b6592fa': '0.1',
      }),
      depositAddress: jest.fn().mockResolvedValue({
        address: 'mixinDepositAddress',
        memo: 'mixinMemo',
      }),
    };
    rebalanceRepositoryMock = {
      getCurrencyMinAmountBySymbol: jest.fn().mockResolvedValue('0.2'),
      addRebalanceHistory: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RebalanceService,
        {
          provide: ExchangeService,
          useValue: exchangeServiceMock,
        },
        {
          provide: SnapshotsService,
          useValue: snapshotsServiceMock,
        },
        {
          provide: RebalanceRepository,
          useValue: rebalanceRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<RebalanceService>(RebalanceService);
  });

  it('should trigger rebalance from exchange to Mixin', async () => {
    await service.rebalance();
    expect(exchangeServiceMock.createWithdrawal).toHaveBeenCalled();
  });
});

describe('Rebalancing from Mixin to exchange', () => {
  let service: RebalanceService;
  let exchangeServiceMock: Partial<ExchangeService>;
  let snapshotsServiceMock: Partial<SnapshotsService>;
  let rebalanceRepositoryMock: Partial<RebalanceRepository>;

  beforeEach(async () => {
    exchangeServiceMock = {
      getAllAPIKeysBalance: jest.fn().mockResolvedValue({
        exchange1: {
          apiKeyBalances: [
            { api_key_id: 'key1', balances: { BTC: '0.5' } },
            { api_key_id: 'key2', balances: { BTC: '0.4' } },
          ],
        },
      }),
      aggregateBalancesByExchange: jest.fn().mockReturnValue({
        exchange1: {
          total: { BTC: '0.1' },
          apiKeyBalances: [
            {
              balances: {
                BTC: '0.1',
              },
            },
          ],
        },
        exchange2: {
          total: { BTC: '0.1' },
          apiKeyBalances: [
            {
              balances: {
                BTC: '0.1',
              },
            },
          ],
        },
      }),
      createWithdrawal: jest.fn(),
      findFirstAPIKeyByExchange: jest
        .fn()
        .mockResolvedValue([{ key_id: 'key1' }]),
      getDepositAddress: jest.fn().mockResolvedValue({
        address: 'mixinDepositAddress',
        memo: 'mixinMemo',
      }),
    };
    snapshotsServiceMock = {
      getAllAssetBalances: jest.fn().mockResolvedValue({
        'c6d0c728-2624-429b-8e0d-d9d19b6592fa': '1',
      }),
      depositAddress: jest.fn().mockResolvedValue({
        address: 'mixinDepositAddress',
        memo: 'mixinMemo',
      }),
      withdrawal: jest.fn().mockResolvedValue({}),
    };
    rebalanceRepositoryMock = {
      getCurrencyMinAmountBySymbol: jest.fn().mockResolvedValue('0.2'),
      addRebalanceHistory: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RebalanceService,
        {
          provide: ExchangeService,
          useValue: exchangeServiceMock,
        },
        {
          provide: SnapshotsService,
          useValue: snapshotsServiceMock,
        },
        {
          provide: RebalanceRepository,
          useValue: rebalanceRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<RebalanceService>(RebalanceService);
  });

  it('should trigger rebalance from Mixin to exchange', async () => {
    await service.rebalance();
    expect(snapshotsServiceMock.withdrawal).toHaveBeenCalled();
  });
});
