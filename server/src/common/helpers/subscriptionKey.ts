import { marketDataType } from 'src/modules/marketdata/marketdata.service';

export interface CompositeKey {
  type: marketDataType;
  exchange: string;
  symbol?: string;
  symbols?: string[];
  timeFrame?: string;
}

export const createCompositeKey = (
  type: marketDataType,
  exchange: string,
  symbol?: string,
  symbols?: string[],
  timeFrame?: string,
): string => {
  let key = '';
  if (type === 'orderbook' || type === 'ticker') {
    key = `${type}:${exchange}:${symbol}`;
  } else if (type === 'OHLCV') {
    key = `${type}:${exchange}:${symbol}:${timeFrame}`;
  } else if (type === 'tickers') {
    key = `${type}:${exchange}:${symbols}`;
  }
  return key;
};

export const decodeCompositeKey = (compositeKey: string): CompositeKey => {
  const parts = compositeKey.split(':');
  const type = parts[0] as marketDataType;
  const exchange = parts[1];
  let decodedKey: CompositeKey = { type, exchange };

  if (type === 'orderbook' || type === 'ticker') {
    const symbol = parts[2];
    decodedKey = { ...decodedKey, symbol };
  } else if (type === 'OHLCV') {
    const symbol = parts[2];
    const timeFrame = parts[3];
    decodedKey = { ...decodedKey, symbol, timeFrame };
  } else if (type === 'tickers') {
    const symbols = parts.slice(2);
    decodedKey = { ...decodedKey, symbols };
  }

  return decodedKey;
};
