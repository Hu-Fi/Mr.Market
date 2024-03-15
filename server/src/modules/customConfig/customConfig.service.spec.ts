import { Test, TestingModule } from '@nestjs/testing';
import { CustomConfigService } from './customConfig.service';
import { CustomConfigRepository } from './customConfig.repository';
import { getRepositoryToken } from '@nestjs/typeorm';

// Mock CustomConfigRepository methods
const mockCustomConfigRepository = () => ({
  readSpotFee: jest.fn(),
  modifySpotFee: jest.fn(),
  modifyMaxBalanceInMixinBot: jest.fn(),
  modifyMaxBalanceInAPIKey: jest.fn(),
  readFundingAccountStatus: jest.fn(),
});

describe('CustomConfigService', () => {
  let service: CustomConfigService;
  let repository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomConfigService,
        {
          provide: getRepositoryToken(CustomConfigRepository),
          useFactory: mockCustomConfigRepository,
        },
      ],
    }).compile();

    service = module.get<CustomConfigService>(CustomConfigService);
    repository = module.get(getRepositoryToken(CustomConfigRepository));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('readSpotFee', () => {
    it('should call readSpotFee on the repository', async () => {
      repository.readSpotFee.mockResolvedValue('some fee');
      const result = await service.readSpotFee();
      expect(result).toEqual('some fee');
      expect(repository.readSpotFee).toHaveBeenCalled();
    });
  });

  describe('modifySpotFee', () => {
    it('should update the spot fee', async () => {
      const newSpotFee = '0.5%';
      repository.modifySpotFee.mockResolvedValue(newSpotFee);
      const result = await service.modifySpotFee(newSpotFee);
      expect(result).toEqual(newSpotFee);
      expect(repository.modifySpotFee).toHaveBeenCalledWith(newSpotFee);
    });
  });

  describe('modifyMaxBalanceInMixinBot', () => {
    it('should update the max balance in Mixin Bot', async () => {
      const newMaxBalance = '1000';
      repository.modifyMaxBalanceInMixinBot.mockResolvedValue(newMaxBalance);
      const result = await service.modifyMaxBalanceInMixinBot(newMaxBalance);
      expect(result).toEqual(newMaxBalance);
      expect(repository.modifyMaxBalanceInMixinBot).toHaveBeenCalledWith(
        newMaxBalance,
      );
    });
  });

  describe('modifyMaxBalanceInAPIKey', () => {
    it('should update the max balance in API Key', async () => {
      const newMaxBalance = '2000';
      repository.modifyMaxBalanceInAPIKey.mockResolvedValue(newMaxBalance);
      const result = await service.modifyMaxBalanceInAPIKey(newMaxBalance);
      expect(result).toEqual(newMaxBalance);
      expect(repository.modifyMaxBalanceInAPIKey).toHaveBeenCalledWith(
        newMaxBalance,
      );
    });
  });

  describe('readFundingAccountStatus', () => {
    it('should return the funding account status', async () => {
      const status = { isActive: true, balance: '500' };
      repository.readFundingAccountStatus.mockResolvedValue(status);
      const result = await service.readFundingAccountStatus();
      expect(result).toEqual(status);
      expect(repository.readFundingAccountStatus).toHaveBeenCalled();
    });
  });
});
