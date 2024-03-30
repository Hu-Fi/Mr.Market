import {
  SPOT_EXCHANGE_MAP,
  SPOT_ORDER_TYPE_MAP,
  TARDING_TYPE_MAP,
} from 'src/common/constants/memo';
import {
  ExchangeIndexValue,
  SpotOrderTypeValue,
  TradingTypeValue,
} from 'src/common/types/memo/memo';

export const isTradingTypeValueValid = (tradingType: string): boolean => {
  const validTradingTypes: TradingTypeValue[] = Object.values(TARDING_TYPE_MAP);
  return validTradingTypes.includes(tradingType as TradingTypeValue);
};
export const isSpotOrderTypeValueValid = (spotOrderType: string): boolean => {
  const validSpotOrderTypes: SpotOrderTypeValue[] =
    Object.values(SPOT_ORDER_TYPE_MAP);
  return validSpotOrderTypes.includes(spotOrderType as SpotOrderTypeValue);
};
export const isExchangeIndexValueValid = (exchangeIndex: string): boolean => {
  const validExchangeIndexes: ExchangeIndexValue[] =
    Object.values(SPOT_EXCHANGE_MAP);
  return validExchangeIndexes.includes(exchangeIndex as ExchangeIndexValue);
};
