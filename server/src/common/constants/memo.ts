import { TradingType, SpotOrderType, ExchangeIndex } from '../types/memo/memo';

export const tradingTypeMap: Record<TradingType, string> = {
  SP: 'Spot',
  SW: 'Swap',
  MM: 'Market Making',
  AR: 'Arbitrage',
  LE: 'Leverage',
  PE: 'Perpetual',
};

export const spotOrderTypeMap: Record<SpotOrderType, string> = {
  LB: 'Limit Buy',
  LS: 'Limit Sell',
  MB: 'Market Buy',
  MS: 'Market Sell',
};

export const spotExchangeMap: Record<ExchangeIndex, string> = {
  '01': 'binance',
  '02': 'bitfinex',
  '03': 'mexc',
  '04': 'okx',
};
