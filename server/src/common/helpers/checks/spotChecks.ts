import {
  SPOT_ORDER_TYPE_MAP,
  TARDING_TYPE_MAP,
} from 'src/common/constants/memo';
import {
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
