import { Test, TestingModule } from '@nestjs/testing';
import { GrowdataController } from './grow-data.controller';
import { GrowdataService } from './grow-data.service';

describe('GrowdataController', () => {
  let controller: GrowdataController;
  let service: GrowdataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GrowdataController],
      providers: [
        {
          provide: GrowdataService,
          useValue: {
            getGrowData: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<GrowdataController>(GrowdataController);
    service = module.get<GrowdataService>(GrowdataService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getGrowData', () => {
    it('should return grow data', async () => {
      const mockGrowData = {
        exchanges: [],
        simply_grow: { tokens: [] },
        arbitrage: { pairs: [] },
        market_making: { pairs: [] },
      };
      jest.spyOn(service, 'getGrowData').mockResolvedValue(mockGrowData);

      const result = await controller.getGrowData();
      expect(result).toEqual(mockGrowData);
      expect(service.getGrowData).toHaveBeenCalled();
    });
  });
});
