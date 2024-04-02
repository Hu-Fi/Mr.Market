import {
  TARDING_TYPE_MAP,
  SPOT_ORDER_TYPE_MAP,
  SPOT_EXCHANGE_MAP,
} from 'src/common/constants/memo';
import {
  SpotMemoDetails,
  TradingType,
  SpotOrderType,
  ExchangeIndex,
} from 'src/common/types/memo/memo';
import { PairsMapKey } from 'src/common/types/pairs/pairs';

export const decodeSpotMemo = (encodedMemo: string): SpotMemoDetails => {
  // Decode base64
  const decodedMemo = Buffer.from(encodedMemo, 'base64').toString('utf-8');
  if (!decodedMemo) {
    return null;
  }
  // Split memo string into parts
  const parts = decodedMemo.split(':');
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
    refId: parts.length === 6 ? refId : undefined,
  };
};

export const decodeSwapMemo = () => {};

// We need to determine we support 1 token creation or not

export const decodeArbitrageMemo = (encodedMemo: string) => {
  // Decode base64
  const decodedMemo = Buffer.from(encodedMemo, 'base64').toString('utf-8');
  if (!decodedMemo) {
    return null;
  }
  // const parts = decodedMemo.split(':');
};

export const decodeMarketMakingMemo = (encodedMemo: string) => {
  // Decode base64
  const decodedMemo = Buffer.from(encodedMemo, 'base64').toString('utf-8');
  if (!decodedMemo) {
    return null;
  }
  // const parts = decodedMemo.split(':');
};
