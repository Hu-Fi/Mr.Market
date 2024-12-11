import { Test, TestingModule } from '@nestjs/testing';
import { StrategyController } from './strategy.controller';
import { StrategyService } from './strategy.service';
import { StrategyUserService } from './strategy-user.service';
import { AdminStrategyService } from '../admin/strategy/adminStrategy.service';

const mockStrategyService = {
  // mock methods of StrategyService that are used by StrategyController
};
const mockStrategyUserService = {};

describe('StrategyController', () => {
  let controller: StrategyController;
  // let adminService: AdminStrategyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StrategyController],
      providers: [
        {
          provide: AdminStrategyService,
          useValue: {
            joinStrategy: jest.fn(),
          }, // Use the mock admin here
        },
        {
          provide: StrategyService,
          useValue: mockStrategyService, // Use the mock StrategyService here
        },
        {
          provide: StrategyUserService,
          useValue: mockStrategyUserService, // Use the mock StrategyService here
        },
      ],
    }).compile();

    controller = module.get<StrategyController>(StrategyController);
    // adminService = module.get<AdminStrategyService>(AdminStrategyService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Add your controller tests here...
});
