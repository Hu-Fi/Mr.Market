import { createCompositeKey, decodeCompositeKey } from './subscriptionKey'; // Adjust the import path as necessary
import { marketDataType } from '../../modules/data/market-data/market-data.service'; // Adjust the import path as necessary

describe('Key Utils', () => {
  describe('createCompositeKey', () => {
    it('should create a composite key for orderbook correctly', () => {
      const type: marketDataType = 'orderbook';
      const exchange = 'binance';
      const symbol = 'BTC/USD';
      const expectedKey = 'orderbook:binance:BTC/USD';

      const key = createCompositeKey(type, exchange, symbol);
      expect(key).toEqual(expectedKey);
    });

    it('should create a composite key for OHLCV correctly', () => {
      const type: marketDataType = 'OHLCV';
      const exchange = 'binance';
      const symbol = 'BTC/USD';
      const timeFrame = '1m';
      const expectedKey = 'OHLCV:binance:BTC/USD:1m';

      const key = createCompositeKey(
        type,
        exchange,
        symbol,
        undefined,
        timeFrame,
      );
      expect(key).toEqual(expectedKey);
    });

    it('should create a composite key for tickers correctly', () => {
      const type: marketDataType = 'tickers';
      const exchange = 'binance';
      const symbols = ['BTC/USD', 'ETH/USD'];
      const expectedKey = `tickers:binance:${symbols.toString()}`;

      const key = createCompositeKey(type, exchange, undefined, symbols);
      expect(key).toEqual(expectedKey);
    });
  });

  describe('decodeCompositeKey', () => {
    it('should decode a composite key for orderbook correctly', () => {
      const compositeKey = 'orderbook:binance:BTC/USD';
      const expected = {
        type: 'orderbook',
        exchange: 'binance',
        symbol: 'BTC/USD',
      };

      const decodedKey = decodeCompositeKey(compositeKey);
      expect(decodedKey).toEqual(expected);
    });

    it('should decode a composite key for OHLCV correctly', () => {
      const compositeKey = 'OHLCV:binance:BTC/USD:1m';
      const expected = {
        type: 'OHLCV',
        exchange: 'binance',
        symbol: 'BTC/USD',
        timeFrame: '1m',
      };

      const decodedKey = decodeCompositeKey(compositeKey);
      expect(decodedKey).toEqual(expected);
    });

    it('should decode a composite key for tickers correctly', () => {
      const compositeKey = 'tickers:binance:BTC/USD,ETH/USD';
      const expected = {
        type: 'tickers',
        exchange: 'binance',
        symbols: ['BTC/USD', 'ETH/USD'],
      };

      const decodedKey = decodeCompositeKey(compositeKey);
      expect(decodedKey).toEqual(expected);
    });
  });
});
