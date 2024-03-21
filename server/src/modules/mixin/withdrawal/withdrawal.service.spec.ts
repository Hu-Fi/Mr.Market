import { Test, TestingModule } from '@nestjs/testing';
import { WithdrawalService } from './withdrawal.service';
import { ConfigService } from '@nestjs/config';

describe.skip('getBestFeeByAssetID', () => {
  let service: WithdrawalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WithdrawalService, ConfigService],
    }).compile();

    service = module.get<WithdrawalService>(WithdrawalService);
  });

  it('BigOne vs Mixin BTC', async () => {
    const result = await service.getBestFeeByAssetID(
      'c6d0c728-2624-429b-8e0d-d9d19b6592fa',
    );
    expect(result.source).toBe('BigOne');
  });

  it('BigOne vs Mixin ETH', async () => {
    const result = await service.getBestFeeByAssetID(
      '43d61dcd-e413-450d-80b8-101d5e903357',
    );
    // console.log(result);
    expect(result.source).toBe('BigOne');
  });

  it('BigOne vs Mixin TRX', async () => {
    const result = await service.getBestFeeByAssetID(
      '43d61dcd-e413-450d-80b8-101d5e903357',
    );
    // console.log(result);
    expect(result.source).toBe('BigOne');
  });
});
