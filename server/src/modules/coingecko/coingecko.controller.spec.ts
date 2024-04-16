import { CoingeckoController } from './coingecko.controller';
import { CoingeckoProxyService } from './coingecko.service';
import { Test, TestingModule } from '@nestjs/testing';
import {
  coinFullInfoFixture,
  coinMarketChartResponseFixture,
  coinMarketDataFixture,
} from './coingecko.fixtures';

describe('CoingeckoController', () => {
  let controller: CoingeckoController;
  let service: CoingeckoProxyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoingeckoController],
      providers: [
        {
          provide: CoingeckoProxyService,
          useValue: {
            coinsId: jest.fn(),
            coinsMarkets: jest.fn(),
            coinsIdMarketChart: jest.fn(),
            coinIdMarketChartRange: jest.fn(),
          },
        },
      ],
    }).compile();
    controller = module.get<CoingeckoController>(CoingeckoController);
    service = module.get<CoingeckoProxyService>(CoingeckoProxyService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get coins by id', async () => {
    const id = '7';
    const expectedResult = coinFullInfoFixture;
    (service.coinsId as jest.Mock).mockReturnValueOnce(expectedResult);
    const result = await controller.getCoinsById(id);
    expect(service.coinsId).toHaveBeenCalledWith(id);
    expect(result).toEqual(expectedResult);
  });
  it('should get coin markets with requested currency', async () => {
    const currency = 'ethereum';
    const expectedResult = coinMarketDataFixture;
    (service.coinsMarkets as jest.Mock).mockReturnValueOnce(expectedResult);
    const result = await controller.getCoinMarkets(currency);
    expect(service.coinsMarkets).toHaveBeenCalledWith(currency);
    expect(result).toEqual(expectedResult);
  });
  it('should get coin markets by category', async () => {
    const currency = 'ethereum';
    const expectedResult = [coinMarketDataFixture[2]];
    const category = 'stablecoins';
    (service.coinsMarkets as jest.Mock).mockReturnValueOnce(expectedResult);
    const result = await controller.getCoinMarketsByCategory(
      currency,
      category,
    );
    expect(service.coinsMarkets).toHaveBeenCalledWith(currency, category);
    expect(result).toEqual(expectedResult);
  });
  it('should get coin markets with all category', async () => {
    const currency = 'ethereum';
    const expectedResult = coinMarketDataFixture;
    const category = 'all';
    (service.coinsMarkets as jest.Mock).mockReturnValueOnce(expectedResult);
    const result = await controller.getCoinMarketsByCategory(
      currency,
      category,
    );
    expect(service.coinsMarkets).toHaveBeenCalledWith(currency, undefined);
    expect(result).toEqual(expectedResult);
  });
  it('should get coin market chart', async () => {
    const expectedResult = coinMarketChartResponseFixture;
    const id = 'ethereum';
    const days = 59;
    const to = 1614556800000;
    const currency = 'ethereum';
    (service.coinsIdMarketChart as jest.Mock).mockReturnValueOnce(
      expectedResult,
    );
    const result = await controller.getCoinIdMarketChart(
      id,
      days,
      to,
      currency,
    );
    expect(service.coinsIdMarketChart).toHaveBeenCalledWith(id, days, currency);
    expect(result).toEqual(expectedResult);
  });

  it('should get coin market chart by range', async () => {
    const expectedResult = coinMarketChartResponseFixture;
    const id = 'ethereum';
    const from = 1609459200000;
    const to = 1614556800000;
    const currency = 'ethereum';
    (service.coinIdMarketChartRange as jest.Mock).mockReturnValueOnce(
      expectedResult,
    );
    const result = await controller.getCoinIdMarketRange(
      id,
      from,
      to,
      currency,
    );
    expect(service.coinIdMarketChartRange).toHaveBeenCalledWith(
      id,
      from,
      to,
      currency,
    );
    expect(result).toEqual(expectedResult);
  });
});
