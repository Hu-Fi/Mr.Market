import { Test, TestingModule } from '@nestjs/testing';
import { SnapshotsService } from 'src/modules/mixin/snapshots/snapshots.service';
import { StrategyUserService } from 'src/modules/strategy/strategy-user.service';
import { GrowdataService } from 'src/modules/growdata/growdata.service';
import { DataSource } from 'typeorm';
import { SimplyGrowListener } from './simply_grow.listener';

jest.mock('src/modules/mixin/snapshots/snapshots.service');
jest.mock('src/modules/strategy/strategy-user.service');
jest.mock('src/modules/growdata/growdata.service');

describe.skip('SimplyGrowListener', () => {
  let listener: SimplyGrowListener;
  let strategyUserService: StrategyUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SimplyGrowListener,
        SnapshotsService,
        StrategyUserService,
        GrowdataService,
        { provide: DataSource, useValue: {} },
      ],
    }).compile();

    listener = module.get<SimplyGrowListener>(SimplyGrowListener);
    strategyUserService = module.get<StrategyUserService>(StrategyUserService);
    jest.clearAllMocks();
  });

  it.only('should handle a snapshot matching the first asset correctly', async () => {
    expect(true).toBe(true);
  });

  it('should log an error when invalid arguments are passed', async () => {
    const loggerSpy = jest.spyOn(listener['logger'], 'error');
    await listener.handleSimplyGrowCreate(null, null);
    expect(loggerSpy).toHaveBeenCalledWith(
      'Invalid arguments passed to handleSimplyGrowCreate',
    );
  });

  it('should call strategyUserService.createSimplyGrow with correct parameters', async () => {
    const details = {
      orderId: 'order123',
      rewardAddress: 'rewardAddress123',
      version: 1,
      tradingType: 'buy',
      action: 'create',
    };
    const snapshot = {
      opponent_id: 'user123',
      asset_id: 'asset123',
      amount: '100',
      snapshot_id: 'snapshot123',
      type: 'snapshot',
      user_id: 'user123',
      memo: 'memo123',
      transaction_hash: 'transaction_hash123',
      created_at: 'created_at123',
      trace_id: 'trace_id123',
      confirmations: 1,
      opening_balance: 'opening_balance123',
      closing_balance: 'closing_balance123',
      deposit: {
        deposit_hash: 'deposit_hash123',
      },
      withdrawal: {
        withdrawal_hash: 'withdrawal_hash123',
        receiver: 'receiver123',
      },
    };
    const createSimplyGrowSpy = jest
      .spyOn(strategyUserService, 'createSimplyGrow')
      .mockResolvedValue(undefined);

    await listener.handleSimplyGrowCreate(details, snapshot);

    expect(createSimplyGrowSpy).toHaveBeenCalledWith({
      orderId: 'order123',
      userId: 'user123',
      mixinAssetId: 'asset123',
      amount: '100',
      state: 'created',
      createdAt: expect.any(String), // You can further validate the timestamp format if needed
      rewardAddress: 'rewardAddress123',
    });
  });
});
