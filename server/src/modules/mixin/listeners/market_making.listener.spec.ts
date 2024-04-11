import { Test, TestingModule } from '@nestjs/testing';
import { MarketMakingListener } from './market_making.listener';
import { SnapshotsService } from 'src/modules/mixin/snapshots/snapshots.service';
import { StrategyUserService } from 'src/modules/strategy/strategy-user.service';
import { SafeSnapshot } from '@mixin.dev/mixin-node-sdk';

jest.mock('src/modules/mixin/snapshots/snapshots.service');
jest.mock('src/modules/strategy/strategy-user.service');

describe('MarketMakingListener', () => {
  let listener: MarketMakingListener;
  let snapshotsService: SnapshotsService;
  let strategyUserService: StrategyUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarketMakingListener, SnapshotsService, StrategyUserService],
    }).compile();

    listener = module.get<MarketMakingListener>(MarketMakingListener);
    snapshotsService = module.get<SnapshotsService>(SnapshotsService);
    strategyUserService = module.get<StrategyUserService>(StrategyUserService);

    jest.clearAllMocks();
  });

  it('should handle a snapshot matching the first asset correctly', async () => {
    const mockDetails = {
      tradingType: 'Market Making',
      action: 'create',
      exchangeName: 'mexc',
      symbol: 'BTC/USDT',
      traceId: '1043e42c-dd12-4260-a443-d1896b64eae4',
    };

    const mockSnapshot: SafeSnapshot = {
      asset_id: 'c6d0c728-2624-429b-8e0d-d9d19b6592fa', // Assuming this matches the base asset ID for BTC/USDT
      amount: '100',
      snapshot_id: 'e82afdfb-6239-4530-8a45-d86294750da6',
      opponent_id: '9f771b3d-15c0-42e1-ae05-bcdc1c5c54f3',
      type: 'transaction',
      created_at: '2024-04-09T15:34:37Z',
      trace_id: '1043e42c-dd12-4260-a443-d1896b64eae4',
      user_id: '1a02b381-2323-4814-b572-1e24ebcbe922',
      memo: 'xxx',
      transaction_hash: 'tx',
      confirmations: null,
      opening_balance: null,
      closing_balance: null,
      deposit: null,
      withdrawal: null,
    };

    // const getAssetIDBySymbol = jest.fn().mockReturnValue({
    //   baseAssetID: mockSnapshot.asset_id,
    //   targetAssetID: '4d8c508b-91c5-375b-92b0-ee702ed2dac5',
    // });

    strategyUserService.findPaymentStateByIdRaw = jest
      .fn()
      .mockResolvedValue(null);
    strategyUserService.createPaymentState = jest.fn().mockResolvedValue({});

    await listener.handleMarketMakingCreate(mockDetails, mockSnapshot);

    // expect(getAssetIDBySymbol).toHaveBeenCalledWith(mockDetails.symbol);
    expect(strategyUserService.findPaymentStateByIdRaw).toHaveBeenCalledWith(
      mockDetails.traceId,
    );
    expect(strategyUserService.createPaymentState).toHaveBeenCalledWith(
      expect.objectContaining({
        orderId: mockDetails.traceId,
        type: 'market_making',
        symbol: mockDetails.symbol,
        firstAssetId: mockSnapshot.asset_id,
        firstAssetAmount: mockSnapshot.amount,
        firstSnapshotId: mockSnapshot.snapshot_id,
      }),
    );
  });

  it('should refund if the snapshot asset does not match either base or target asset IDs', async () => {
    const mockDetails = {
      tradingType: 'Market Making',
      action: 'create',
      exchangeName: 'mexc',
      symbol: 'BTC/USDT',
      traceId: '1043e42c-dd12-4260-a443-d1896b64eae4',
    };

    const mockSnapshot: SafeSnapshot = {
      asset_id: 'b91e18ff-a9ae-3dc7-8679-e935d9a4b34b', // Asset ID that doesn't match the expected for BTC/USDT
      amount: '100',
      snapshot_id: 'e82afdfb-6239-4530-8a45-d86294750dc3',
      opponent_id: '9f771b3d-15c0-42e1-ae05-bcdc1c5c54f3',
      type: 'transaction',
      created_at: '2024-04-09T15:34:37Z',
      trace_id: '1043e42c-dd12-4260-a443-d1896b64eae4',
      user_id: '1a02b381-2323-4814-b572-1e24ebcbe922',
      memo: 'xxx',
      transaction_hash: 'tx',
      confirmations: null,
      opening_balance: null,
      closing_balance: null,
      deposit: null,
      withdrawal: null,
    };

    // const getAssetIDBySymbol = jest.fn().mockReturnValue({
    //   baseAssetID: 'c6d0c728-2624-429b-8e0d-d9d19b6592fa',
    //   targetAssetID: '4d8c508b-91c5-375b-92b0-ee702ed2dac5',
    // });

    snapshotsService.refund = jest.fn().mockResolvedValue({});

    await listener.handleMarketMakingCreate(mockDetails, mockSnapshot);

    // expect(getAssetIDBySymbol).toHaveBeenCalledWith(mockDetails.symbol);
    expect(snapshotsService.refund).toHaveBeenCalledWith(mockSnapshot);
  });
});
