import {
  tradingTypeMap,
  spotOrderTypeMap,
  spotExchangeMap,
} from 'src/common/constants/memo';
import {
  MemoDetails,
  TradingType,
  SpotOrderType,
  ExchangeIndex,
} from 'src/common/types/memo/memo';

export const decodeSpotMemo = (memo: string): MemoDetails => {
  // Split memo string into parts
  const parts = memo.split(':');
  const [
    tradingType,
    spotOrderType,
    exchange,
    destId,
    limitPriceOrRefId,
    refId,
  ] = parts;

  return {
    tradingType: tradingTypeMap[tradingType as TradingType],
    spotOrderType: spotOrderTypeMap[spotOrderType as SpotOrderType],
    exchange: spotExchangeMap[exchange as ExchangeIndex],
    destId,
    limitPrice: parts.length === 6 ? limitPriceOrRefId : undefined,
    refId: parts.length === 6 ? refId : limitPriceOrRefId,
  };
};

export const decodeSwapMemo = (memo: string) => {};
