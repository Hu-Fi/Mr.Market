import { Test, TestingModule } from '@nestjs/testing';
import { CustomConfigService } from 'src/modules/customConfig/customConfig.service';
import { CustomConfigRepository } from 'src/modules/customConfig/customConfig.repository';

describe('CustomConfigService', () => {
  let service: CustomConfigService;
  // Explicitly type the mock repository
  let mockRepository: {
    readSpotFee: jest.Mock;
    modifySpotFee: jest.Mock;
    modifyMaxBalanceInMixinBot: jest.Mock;
    modifyMaxBalanceInAPIKey: jest.Mock;
    readFundingAccountStatus: jest.Mock;
  };

  beforeEach(async () => {
    mockRepository = {
      readSpotFee: jest.fn(),
      modifySpotFee: jest.fn(),
      modifyMaxBalanceInMixinBot: jest.fn(),
      modifyMaxBalanceInAPIKey: jest.fn(),
      readFundingAccountStatus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomConfigService,
        { provide: CustomConfigRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<CustomConfigService>(CustomConfigService);
    // No need to get the mockRepository from the module since it's already defined above
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(mockRepository).toBeDefined();
  });

  describe('readSpotFee', () => {
    it('should return spot fee', async () => {
      mockRepository.readSpotFee.mockResolvedValue('0.1');
      await expect(service.readSpotFee()).resolves.toBe('0.1');
      expect(mockRepository.readSpotFee).toHaveBeenCalled();
    });
  });

  describe('modifySpotFee', () => {
    it('should modify the spot fee', async () => {
      const newSpotFee = '0.2';
      // No real return value needed for modify methods unless they return something specific
      mockRepository.modifySpotFee.mockResolvedValue(undefined);
      await service.modifySpotFee(newSpotFee);
      expect(mockRepository.modifySpotFee).toHaveBeenCalledWith(newSpotFee);
    });
  });

  describe('modifyMaxBalanceInMixinBot', () => {
    it('should modify the max balance in Mixin Bot', async () => {
      const newMaxBalance = '1000';
      mockRepository.modifyMaxBalanceInMixinBot.mockResolvedValue(undefined); // Assuming the method does not return a value

      await service.modifyMaxBalanceInMixinBot(newMaxBalance);

      expect(mockRepository.modifyMaxBalanceInMixinBot).toHaveBeenCalledWith(
        newMaxBalance,
      );
    });
  });

  describe('modifyMaxBalanceInAPIKey', () => {
    it('should modify the max balance in API Key', async () => {
      const newMaxBalance = '2000';
      mockRepository.modifyMaxBalanceInAPIKey.mockResolvedValue(undefined);

      await service.modifyMaxBalanceInAPIKey(newMaxBalance);

      expect(mockRepository.modifyMaxBalanceInAPIKey).toHaveBeenCalledWith(
        newMaxBalance,
      );
    });
  });

  describe('readFundingAccountStatus', () => {
    it('should return funding account status', async () => {
      const status = 'active';
      mockRepository.readFundingAccountStatus.mockResolvedValue(status);

      const result = await service.readFundingAccountStatus();

      expect(result).toEqual(status);
      expect(mockRepository.readFundingAccountStatus).toHaveBeenCalled();
    });
  });
});
