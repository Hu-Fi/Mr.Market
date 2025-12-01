import { Test, TestingModule } from '@nestjs/testing';
import { SpotdataController } from './spot-data.controller';
import { SpotdataService } from './spot-data.service';

describe('SpotdataController', () => {
  let controller: SpotdataController;
  let service: SpotdataService;

  const mockTradingPairs = [
    {
      id: 'a87fe0c1-898f-457a-9303-b83bb81b09b5',
      symbol: 'BTC/USDT',
      exchange_id: 'binance',
      base_asset_id: '7e04727a-6f8b-499a-92d0-18bf4ef013bb',
      quote_asset_id: 'ccde90fe-d611-4fc8-afb4-3388e96fbb02',
      change: '1.5',
      amount_siginifianct_figures: '8',
      buy_decimal_digits: '2',
      ccxt_id: 'binance',
      enable: true,
      max_buy_amount: '1000',
      max_sell_amount: '1000',
      price_siginifianct_figures: '2',
      sell_decimal_digits: '2',
    },
    {
      id: 'a87fe0c1-898f-457a-9303-b83bb81b09b5',
      symbol: 'ETH/USDT',
      exchange_id: 'binance',
      base_asset_id: 'a87fe0c1-898f-457a-9303-b83bb81b09b5',
      quote_asset_id: 'ccde90fe-d611-4fc8-afb4-3388e96fbb02',
      change: '2.0',
      amount_siginifianct_figures: '8',
      buy_decimal_digits: '2',
      ccxt_id: 'binance',
      enable: true,
      max_buy_amount: '1000',
      max_sell_amount: '1000',
      price_siginifianct_figures: '2',
      sell_decimal_digits: '2',
    },
  ];

  const mockSpotData = {
    trading_pairs: mockTradingPairs,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpotdataController],
      providers: [
        {
          provide: SpotdataService,
          useValue: {
            getSpotData: jest.fn().mockResolvedValue(mockSpotData),
          },
        },
      ],
    }).compile();

    controller = module.get<SpotdataController>(SpotdataController);
    service = module.get<SpotdataService>(SpotdataService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return spot data', async () => {
    const result = await controller.getSpotData();
    expect(result).toEqual(mockSpotData);
    expect(service.getSpotData).toHaveBeenCalled();
  });
});
