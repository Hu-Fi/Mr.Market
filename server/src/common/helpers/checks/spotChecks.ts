import {
  ExchangeIndex,
  SpotOrderType,
  TradingType,
} from 'src/common/types/memo/memo';

const validators = [
  (tradingType: string): boolean => {
    const validTradingTypes: TradingType[] = [
      'SP',
      'SW',
      'MM',
      'AR',
      'LE',
      'PE',
    ];
    return validTradingTypes.includes(tradingType as TradingType);
  },
  (spotOrderType: string): boolean => {
    const validSpotOrderTypes: SpotOrderType[] = ['LB', 'LS', 'MB', 'MS'];
    return validSpotOrderTypes.includes(spotOrderType as SpotOrderType);
  },
  (exchangeIndex: string): boolean => {
    const validExchangeIndexes: ExchangeIndex[] = ['01', '02', '03', '04'];
    return validExchangeIndexes.includes(exchangeIndex as ExchangeIndex);
  },
];

export const isTradingTypeValid = validators[0];
export const isSpotOrderTypeValid = validators[1];
export const isExchangeIndexValid = validators[2];
