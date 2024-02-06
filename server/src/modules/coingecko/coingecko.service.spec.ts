import { Test, TestingModule } from '@nestjs/testing';
import { CoingeckoProxyService } from './coingecko.service';

describe('CoingeckoProxyService', () => {
  let service: CoingeckoProxyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoingeckoProxyService],
    }).compile();

    service = module.get<CoingeckoProxyService>(CoingeckoProxyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
