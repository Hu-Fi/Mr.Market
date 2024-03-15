import { SPOT_EXCHANGE_MAP, SPOT_ORDER_TYPE_MAP, TARDING_TYPE_MAP } from 'src/common/constants/memo';
import {
  ExchangeIndex,
  SpotOrderType,
  TradingType,
} from 'src/common/types/memo/memo';

const validators = [
  (tradingType: string): boolean => {
    const validTradingTypes: TradingType[] = Object.keys(TARDING_TYPE_MAP);
    return validTradingTypes.includes(tradingType as TradingType);
  },
  (spotOrderType: string): boolean => {
    const validSpotOrderTypes: SpotOrderType[] = Object.keys(SPOT_ORDER_TYPE_MAP);
    return validSpotOrderTypes.includes(spotOrderType as SpotOrderType);
  },
  (exchangeIndex: string): boolean => {
    const validExchangeIndexes: ExchangeIndex[] = Object.keys(SPOT_EXCHANGE_MAP)
    return validExchangeIndexes.includes(exchangeIndex as ExchangeIndex);
  },
];

export const isTradingTypeValid = validators[0];
export const isSpotOrderTypeValid = validators[1];
export const isExchangeIndexValid = validators[2];
