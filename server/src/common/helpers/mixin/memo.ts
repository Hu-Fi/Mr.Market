import {
  TARDING_TYPE_MAP,
  SPOT_ORDER_TYPE_MAP,
  SPOT_EXCHANGE_MAP,
  ARBITRAGE_MEMO_ACTION_MAP,
  MARKET_MAKING_MEMO_ACTION_MAP,
} from 'src/common/constants/memo';
import {
  ArbitrageMemoDetails,
  ExchangeIndexValue,
  MarketMakingMemoActionValueType,
  MarketMakingMemoDetails,
  SpotMemoDetails,
  SpotOrderTypeValue,
  TradingTypeValue,
} from 'src/common/types/memo/memo';
import { PairsMapKey, PairsMapValue } from 'src/common/types/pairs/pairs';
import { getPairSymbolByKey } from '../utils';

export const decodeSpotMemo = (decodedMemo: string): SpotMemoDetails => {
  if (!decodedMemo) {
    return null;
  }
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
    tradingType: TARDING_TYPE_MAP[tradingType] as TradingTypeValue,
    spotOrderType: SPOT_ORDER_TYPE_MAP[spotOrderType] as SpotOrderTypeValue,
    exchangeName: SPOT_EXCHANGE_MAP[exchange] as ExchangeIndexValue,
    destId: destId as PairsMapKey,
    limitPrice: parts.length === 6 ? limitPriceOrRefId : undefined,
    refId: parts.length === 6 ? refId : undefined,
  };
};

export const decodeArbitrageMemo = (
  decodedMemo: string,
): ArbitrageMemoDetails => {
  if (!decodedMemo) {
    return null;
  }
  const parts = decodedMemo.split(':');
  if (parts.length !== 6) {
    return null;
  }
  const [tradingType, action, exchangeAIndex, exchangeBIndex, destId, traceId] =
    parts;

  const symbol = getPairSymbolByKey(destId as PairsMapKey);
  if (!symbol) {
    return null;
  }
  return {
    tradingType: TARDING_TYPE_MAP[tradingType],
    action: ARBITRAGE_MEMO_ACTION_MAP[action],
    exchangeAName: SPOT_EXCHANGE_MAP[exchangeAIndex],
    exchangeBName: SPOT_EXCHANGE_MAP[exchangeBIndex],
    symbol: symbol as PairsMapValue,
    traceId,
  };
};

export const decodeMarketMakingMemo = (
  decodedMemo: string,
): MarketMakingMemoDetails => {
  if (!decodedMemo) {
    return null;
  }
  const parts = decodedMemo.split(':');
  if (parts.length !== 5) {
    return null;
  }
  const [tradingType, action, exchangeIndex, destId, traceId] = parts;
  const symbol = getPairSymbolByKey(destId as PairsMapKey);
  if (!symbol) {
    return null;
  }
  return {
    tradingType: TARDING_TYPE_MAP[tradingType] as TradingTypeValue,
    action: MARKET_MAKING_MEMO_ACTION_MAP[
      action
    ] as MarketMakingMemoActionValueType,
    exchangeName: SPOT_EXCHANGE_MAP[exchangeIndex] as ExchangeIndexValue,
    symbol: symbol as PairsMapKey,
    traceId,
  };
};
