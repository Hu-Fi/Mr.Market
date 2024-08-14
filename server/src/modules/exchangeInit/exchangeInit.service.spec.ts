import * as ccxt from 'ccxt';
import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeInitService } from './exchangeInit.service';
import { InternalServerErrorException } from '@nestjs/common';
import { CustomLogger } from 'src/modules/logger/logger.service';

jest.mock('ccxt', () => ({
  pro: {
    okx: jest.fn(),
    bitfinex: jest.fn(),
    gate: jest.fn(),
    mexc: jest.fn(),
    binance: jest.fn(),
    lbank: jest.fn(),
    bitmart: jest.fn(),
    p2b: jest.fn(),
  },
  bigone: jest.fn(),
  coinlist: jest.fn(),
  digifinex: jest.fn(),
}));

describe('ExchangeInitService', () => {
  let service: ExchangeInitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExchangeInitService, CustomLogger],
    }).compile();

    service = module.get<ExchangeInitService>(ExchangeInitService);
  });

  it('should throw error if exchange is not configured', () => {
    const exchangeName = 'nonexistent';
    expect(() => service.getExchange(exchangeName)).toThrow(
      InternalServerErrorException,
    );
  });

  it('should throw error if exchange label is not configured', async () => {
    const exchangeName = 'okx';
    const label = 'nonexistent';
    await service['initializeExchanges']();

    expect(() => service.getExchange(exchangeName, label)).toThrow(
      InternalServerErrorException,
    );
  });

  it('should return unauthenticated exchange instance', async () => {
    const exchangeName = 'okx';
    const exchangeInstance = { loadMarkets: jest.fn() };
    (ccxt.pro.okx as jest.Mock).mockImplementation(() => exchangeInstance);

    await service['initializeUnauthenticatedExchanges']();
    const unauthenticatedExchange = service.getMarketdataInstance(exchangeName);

    expect(unauthenticatedExchange).toBe(exchangeInstance);
  });
});
