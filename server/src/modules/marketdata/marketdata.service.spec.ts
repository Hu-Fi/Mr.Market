import { Test, TestingModule } from '@nestjs/testing';
import { MarketdataService } from './marketdata.service';

describe('MarketdataService', () => {
  let service: MarketdataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarketdataService],
    }).compile();

    service = module.get<MarketdataService>(MarketdataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
