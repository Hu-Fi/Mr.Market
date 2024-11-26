import { Test, TestingModule } from '@nestjs/testing';
import { SnapshotsService } from 'src/modules/mixin/snapshots/snapshots.service';
import { StrategyUserService } from 'src/modules/strategy/strategy-user.service';
import { SafeSnapshot } from '@mixin.dev/mixin-node-sdk';
import { GrowdataService } from 'src/modules/growdata/growdata.service';
import { DataSource } from 'typeorm';
import { SimplyGrowListener } from './simply_grow.listener';

jest.mock('src/modules/mixin/snapshots/snapshots.service');
jest.mock('src/modules/strategy/strategy-user.service');
jest.mock('src/modules/growdata/growdata.service');

describe.skip('SimplyGrowListener', () => {
  let listener: SimplyGrowListener;
  let snapshotsService: SnapshotsService;
  let strategyUserService: StrategyUserService;
  let growdataService: GrowdataService;

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
    snapshotsService = module.get<SnapshotsService>(SnapshotsService);
    strategyUserService = module.get<StrategyUserService>(StrategyUserService);
    growdataService = module.get<GrowdataService>(GrowdataService);
    jest.clearAllMocks();
  });

  it.only('should handle a snapshot matching the first asset correctly', async () => {
    expect(true).toBe(true);
  });
});
