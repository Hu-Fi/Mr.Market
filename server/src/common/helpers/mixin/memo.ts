import {
  TARDING_TYPE_MAP,
  SPOT_ORDER_TYPE_MAP,
  SPOT_EXCHANGE_MAP,
} from 'src/common/constants/memo';
import {
  MemoDetails,
  TradingType,
  SpotOrderType,
  ExchangeIndex,
} from 'src/common/types/memo/memo';
import { PairsMapKey } from 'src/common/types/pairs/pairs';

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
    tradingType: TARDING_TYPE_MAP[tradingType] as TradingType,
    spotOrderType: SPOT_ORDER_TYPE_MAP[spotOrderType] as SpotOrderType,
    exchangeIndex: SPOT_EXCHANGE_MAP[exchange] as ExchangeIndex,
    destId: destId as PairsMapKey,
    limitPrice: parts.length === 6 ? limitPriceOrRefId : undefined,
    refId: parts.length === 6 ? refId : limitPriceOrRefId,
  };
};

export const decodeSwapMemo = () => {};
