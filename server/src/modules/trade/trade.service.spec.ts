import { Test, TestingModule } from '@nestjs/testing';
import { TradeService } from './trade.service';
import { MarketTradeDto, LimitTradeDto } from './trade.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TradeRepository } from './trade.repository';

jest.mock('ccxt', () => ({
  binance: jest.fn().mockImplementation(() => ({
    createOrder: jest.fn(),
  })),
}));

// Creating a mock repository
const mockTradeRepository = {
  createTransaction: jest.fn().mockResolvedValue(null),
  // Add other methods as needed
};

describe('TradeService', () => {
  let service: TradeService;

  beforeEach(async () => {
    process.env.BINANCE_API_KEY = 'test-api-key';
    process.env.BINANCE_SECRET = 'test-secret';

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TradeService,
        {
          provide: getRepositoryToken(TradeRepository),
          useValue: mockTradeRepository,
        },
      ],
    }).compile();

    service = module.get<TradeService>(TradeService);

    // Resetting mocks before each test
    mockTradeRepository.createTransaction.mockReset();
    // Mock the CCXT exchange createOrder method setup...
    service['exchange'].createOrder = jest
      .fn()
      .mockImplementation((symbol, side, amount, price) => {
        const mockResponse = {
          id: 'order123',
          symbol: symbol,
          side: side,
          amount: amount,
          price: price,
          status: 'closed',
        };
        return Promise.resolve(mockResponse);
      });
  });

  afterEach(() => {
    delete process.env.BINANCE_API_KEY;
    delete process.env.BINANCE_SECRET;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('executeMarketTrade', () => {
    it('should execute a market trade and record a transaction', async () => {
      const marketTradeDto: MarketTradeDto = {
        userId: 'user123',
        clientId: 'client123',
        exchange: 'binance',
        symbol: 'BTC/USD',
        side: 'buy',
        amount: 1,
      };

      await service.executeMarketTrade(marketTradeDto);

      expect(mockTradeRepository.createTransaction).toHaveBeenCalledWith({
        userId: 'user123',
        clientId: 'client123',
        symbol: 'BTC/USD',
        side: 'buy',
        amount: 1,
        type: 'market',
        price: expect.any(Number),
        orderId: expect.any(String),
      });
    });
  });

  describe('executeLimitTrade', () => {
    it('should execute a limit trade and record a transaction', async () => {
      const limitTradeDto: LimitTradeDto = {
        userId: 'user123',
        clientId: 'client123',
        exchange: 'binance',
        symbol: 'BTC/USD',
        side: 'sell',
        amount: 1,
        price: 50000,
      };

      await service.executeLimitTrade(limitTradeDto);

      expect(mockTradeRepository.createTransaction).toHaveBeenCalledWith({
        userId: 'user123',
        clientId: 'client123',
        symbol: 'BTC/USD',
        side: 'sell',
        type: 'limit',
        amount: 1,
        price: 50000,
        orderId: expect.any(String),
      });
    });
  });

  // Additional tests as necessary...
});
