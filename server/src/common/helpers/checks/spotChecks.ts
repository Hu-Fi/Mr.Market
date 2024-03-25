import {
  SPOT_EXCHANGE_MAP,
  SPOT_ORDER_TYPE_MAP,
  TARDING_TYPE_MAP,
} from 'src/common/constants/memo';
import {
  ExchangeIndex,
  SpotOrderType,
  TradingType,
} from 'src/common/types/memo/memo';

export const isTradingTypeValid = (tradingType: string): boolean => {
  const validTradingTypes: TradingType[] = Object.keys(TARDING_TYPE_MAP);
  return validTradingTypes.includes(tradingType as TradingType);
};
export const isSpotOrderTypeValid = (spotOrderType: string): boolean => {
  const validSpotOrderTypes: SpotOrderType[] = Object.keys(SPOT_ORDER_TYPE_MAP);
  return validSpotOrderTypes.includes(spotOrderType as SpotOrderType);
};
export const isExchangeIndexValid = (exchangeIndex: string): boolean => {
  const validExchangeIndexes: ExchangeIndex[] = Object.keys(SPOT_EXCHANGE_MAP);
  return validExchangeIndexes.includes(exchangeIndex as ExchangeIndex);
};
