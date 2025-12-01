import { Test, TestingModule } from '@nestjs/testing';
import { TradeController } from './trade.controller';
import { TradeService } from './trade.service';
import { MarketTradeDto, LimitTradeDto } from './trade.dto';

describe('TradeController', () => {
  let controller: TradeController;
  let mockTradeService: Partial<TradeService>;

  beforeEach(async () => {
    mockTradeService = {
      executeMarketTrade: jest.fn(),
      executeLimitTrade: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TradeController],
      providers: [{ provide: TradeService, useValue: mockTradeService }],
    }).compile();

    controller = module.get<TradeController>(TradeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should execute a market trade', async () => {
    const dto: MarketTradeDto = {
      userId: '123',
      clientId: 'client1',
      exchange: 'binance',
      symbol: 'BTC/USD',
      side: 'buy',
      amount: 1,
    };
    await controller.executeMarketTrade(dto);
    expect(mockTradeService.executeMarketTrade).toHaveBeenCalledWith(dto);
  });

  it('should execute a limit trade', async () => {
    const dto: LimitTradeDto = {
      userId: '123',
      clientId: 'client1',
      exchange: 'binance',
      symbol: 'BTC/USD',
      side: 'sell',
      amount: 1,
      price: 50000,
    };
    await controller.executeLimitTrade(dto);
    expect(mockTradeService.executeLimitTrade).toHaveBeenCalledWith(dto);
  });
});
