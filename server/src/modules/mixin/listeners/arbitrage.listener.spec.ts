import { Test, TestingModule } from '@nestjs/testing';
import { ArbitrageListener } from './arbitrage.listener';
import { SnapshotsService } from 'src/modules/mixin/snapshots/snapshots.service';
import { StrategyUserService } from 'src/modules/strategy/strategy-user.service';
import { SafeSnapshot } from '@mixin.dev/mixin-node-sdk';

jest.mock('src/modules/mixin/snapshots/snapshots.service');
jest.mock('src/modules/strategy/strategy-user.service');

describe('ArbitrageListener', () => {
  let listener: ArbitrageListener;
  let snapshotsService: SnapshotsService;
  let strategyUserService: StrategyUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArbitrageListener, SnapshotsService, StrategyUserService],
    }).compile();

    listener = module.get<ArbitrageListener>(ArbitrageListener);
    snapshotsService = module.get<SnapshotsService>(SnapshotsService);
    strategyUserService = module.get<StrategyUserService>(StrategyUserService);

    jest.clearAllMocks();
  });

  it('should handle a snapshot matching the first asset correctly', async () => {
    const mockDetails = {
      tradingType: 'Arbitrage',
      action: 'create',
      exchangeAName: 'mexc',
      exchangeBName: 'okx',
      symbol: 'BTC/USDT',
      traceId: '1043e42c-dd12-4260-a443-d1896b64eae4',
    };

    const mockSnapshot: SafeSnapshot = {
      asset_id: 'c6d0c728-2624-429b-8e0d-d9d19b6592fa',
      amount: '100',
      snapshot_id: 'e82afdfb-6239-4530-8a45-d86294750da6',
      opponent_id: '9f771b3d-15c0-42e1-ae05-bcdc1c5c54f3',
      type: 'transaction',
      user_id: 'f06b4ecb-1e81-4bf9-b671-2d5ca5694b68',
      memo: 'memo',
      transaction_hash: 'mixin_mainnet_hash',
      created_at: '2024-04-09T15:34:37Z',
      trace_id: '1043e42c-dd12-4260-a443-d1896b64eae4',
      confirmations: null,
      opening_balance: null,
      closing_balance: null,
      deposit: null,
      withdrawal: null,
    };

    // const getAssetIDBySymbolMock = jest.fn().mockReturnValue({
    //   baseAssetID: 'c6d0c728-2624-429b-8e0d-d9d19b6592fa',
    //   targetAssetID: '4d8c508b-91c5-375b-92b0-ee702ed2dac5',
    // });

    strategyUserService.findPaymentStateByIdRaw = jest
      .fn()
      .mockResolvedValue(null);
    strategyUserService.createPaymentState = jest.fn().mockResolvedValue({
      /* Mocked return value */
    });

    await listener.handleArbitrageCreate(mockDetails, mockSnapshot);

    expect(strategyUserService.findPaymentStateByIdRaw).toHaveBeenCalledWith(
      '1043e42c-dd12-4260-a443-d1896b64eae4',
    );
    expect(strategyUserService.createPaymentState).toHaveBeenCalledWith(
      expect.anything(),
    );
  });

  it('should refund if the snapshot asset does not match either base or target asset IDs', async () => {
    const mockDetails = {
      tradingType: 'Arbitrage',
      action: 'create',
      exchangeAName: 'mexc',
      exchangeBName: 'okx',
      symbol: 'BTC/USDT',
      traceId: '1043e42c-dd12-4260-a443-d1896b64eae4',
    };

    const mockSnapshot: SafeSnapshot = {
      asset_id: 'b91e18ff-a9ae-3dc7-8679-e935d9a4b34b',
      amount: '100',
      snapshot_id: 'e82afdfb-6239-4530-8a45-d86294750dc3',
      opponent_id: '9f771b3d-15c0-42e1-ae05-bcdc1c5c54f3',
      type: 'transaction',
      memo: 'memo',
      user_id: 'f06b4ecb-1e81-4bf9-b671-2d5ca5694b68',
      transaction_hash: 'mixin_mainnet_hash',
      created_at: '2024-04-09T15:34:37Z',
      trace_id: '',
      confirmations: 32,
      opening_balance: '',
      closing_balance: '',
      deposit: null,
      withdrawal: null,
    };

    // Assuming getAssetIDBySymbol would have returned IDs that don't match mockSnapshot.asset_id
    strategyUserService.findPaymentStateById = jest
      .fn()
      .mockResolvedValue(null);
    snapshotsService.refund = jest.fn().mockResolvedValue({});

    await listener.handleArbitrageCreate(mockDetails, mockSnapshot);

    expect(snapshotsService.refund).toHaveBeenCalledWith(mockSnapshot);
  });
});
