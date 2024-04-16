import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import createMockCustomConfigEntity from './customConfig.fixture';
import { CustomConfigRepository } from './customConfig.repository';
import { Repository } from 'typeorm';
import { CustomConfigEntity } from '../../common/entities/custom-config.entity';

describe('CustomConfigRepository', () => {
  let customConfigRepository: CustomConfigRepository;
  let mockRepository: Repository<CustomConfigEntity>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CustomConfigRepository,
        {
          provide: getRepositoryToken(CustomConfigEntity),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    customConfigRepository = module.get<CustomConfigRepository>(
      CustomConfigRepository,
    );
    mockRepository = module.get<Repository<CustomConfigEntity>>(
      getRepositoryToken(CustomConfigEntity),
    );
  });

  it('should be defined', () => {
    expect(customConfigRepository).toBeDefined();
    expect(mockRepository).toBeDefined();
  });

  describe('readSpotFee', () => {
    it('should return the spot fee when config exists', async () => {
      const configId = 1;
      const mockConfig = createMockCustomConfigEntity({
        config_id: 1,
        spot_fee: '0.05',
      });
      jest.spyOn(mockRepository, 'findOne').mockResolvedValue(mockConfig);

      const result = await customConfigRepository.readSpotFee(configId);
      expect(result).toEqual('0.05');
    });

    it('should handle config not found', async () => {
      jest.spyOn(mockRepository, 'findOne').mockResolvedValue(null);

      await expect(customConfigRepository.readSpotFee()).rejects.toThrow(
        new Error(`Configuration with ID 0 not found.`),
      );
    });
  });

  describe('modifySpotFee', () => {
    it('should modify the spot fee', async () => {
      const configId = 1;
      const newSpotFee = '0.03';
      const mockConfig = createMockCustomConfigEntity({
        config_id: configId,
        spot_fee: '0.05',
      });
      jest.spyOn(mockRepository, 'findOne').mockResolvedValue(mockConfig);
      const newConfig: CustomConfigEntity = {
        ...mockConfig,
        spot_fee: newSpotFee,
      };
      jest.spyOn(mockRepository, 'save').mockResolvedValue(newConfig);

      await customConfigRepository.modifySpotFee(newSpotFee, configId);
      expect(mockRepository.save).toHaveBeenCalledWith(newConfig);
    });
  });

  describe('modifyMaxBalanceInMixinBot', () => {
    it('should modify max balance in mixin bot', async () => {
      const configId = 1;
      const oldMaxBalanceMixinBot = '999';
      const newMaxBalanceMixinBot = '1340';
      const mockConfig = createMockCustomConfigEntity({
        config_id: configId,
        max_balance_mixin_bot: oldMaxBalanceMixinBot,
      });
      const newConfig: CustomConfigEntity = {
        ...mockConfig,
        max_balance_mixin_bot: newMaxBalanceMixinBot,
      };
      jest.spyOn(mockRepository, 'save').mockResolvedValue(newConfig);
      jest.spyOn(mockRepository, 'findOne').mockResolvedValueOnce(mockConfig);
      await customConfigRepository.modifyMaxBalanceInMixinBot(
        newMaxBalanceMixinBot,
        configId,
      );
      expect(mockRepository.save).toHaveBeenCalledWith(newConfig);
    });
  });
  describe('readFundingAccount', () => {
    it('should read funding account', async () => {
      const configId = 1;
      const fundingAccount = 'JP2137';
      const mockConfig = createMockCustomConfigEntity({
        config_id: configId,
        funding_account: fundingAccount,
      });
      jest.spyOn(mockRepository, 'findOne').mockResolvedValueOnce(mockConfig);
      const response = await customConfigRepository.readFundingAccountStatus(
        configId,
      );
      expect(response).toEqual(fundingAccount);
    });
  });
});
