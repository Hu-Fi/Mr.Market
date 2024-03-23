import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { RebalanceService } from 'src/modules/mixin/rebalance/rebalance.service';

describe.skip('getBestFeeByAssetID', () => {
  let service: RebalanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RebalanceService, ConfigService],
    }).compile();

    service = module.get<RebalanceService>(RebalanceService);
  });
});
