import { Test, TestingModule } from '@nestjs/testing';
import { PerformanceController } from './performance.controller';
import { PerformanceService } from './performance.service'; // Import the service

describe('PerformanceController', () => {
  let controller: PerformanceController;

  // Mock service implementation
  const mockPerformanceService = {
    // mock methods that are used by the PerformanceController
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PerformanceController],
      providers: [
        {
          provide: PerformanceService,
          useValue: mockPerformanceService, // Provide the mock implementation
        },
      ],
    }).compile();

    controller = module.get<PerformanceController>(PerformanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
