import { Test, TestingModule } from '@nestjs/testing';
import { StrategyRewardsService } from './strategy-rewards.service';

describe('StrategyRewardsService', () => {
  let service: StrategyRewardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StrategyRewardsService],
    }).compile();

    service = module.get<StrategyRewardsService>(StrategyRewardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
