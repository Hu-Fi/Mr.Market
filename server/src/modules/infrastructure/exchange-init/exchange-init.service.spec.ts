import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeInitService } from './exchange-init.service';

describe('ExchangeinitService', () => {
  let service: ExchangeInitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExchangeInitService],
    }).compile();

    service = module.get<ExchangeInitService>(ExchangeInitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
