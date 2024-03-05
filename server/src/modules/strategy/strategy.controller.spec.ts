import { Test, TestingModule } from '@nestjs/testing';
import { StrategyController } from './strategy.controller';
import { StrategyService } from './strategy.service';

const mockStrategyService = {
  // mock methods of StrategyService that are used by StrategyController
};

describe('StrategyController', () => {
  let controller: StrategyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StrategyController],
      providers: [
        {
          provide: StrategyService,
          useValue: mockStrategyService, // Use the mock StrategyService here
        },
      ],
    }).compile();

    controller = module.get<StrategyController>(StrategyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Add your controller tests here...
});
