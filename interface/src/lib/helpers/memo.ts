import { PAIRS_MAP_REVERSED } from "./constants";

// related to 
// /server/src/common/helpers/mixin/memo.ts
// /server/src/common/constants/memo.ts
export const TARDING_TYPE_MAP: Record<string, string> = {
  SP: 'Spot',
  SW: 'Swap',
  MM: 'Market Making',
  AR: 'Arbitrage',
  LE: 'Leverage',
  PE: 'Perpetual',
};

export const SPOT_ORDER_TYPE_MAP: Record<string, string> = {
  LB: 'Limit Buy',
  LS: 'Limit Sell',
  MB: 'Market Buy',
  MS: 'Market Sell',
};

export const SPOT_EXCHANGE_MAP: Record<string, string> = {
  '01': 'binance',
  '02': 'bitfinex',
  '03': 'mexc',
  '04': 'okx',
  '05': 'gate',
  '06': 'lbank',
};

export const REVERSED_TARDING_TYPE_MAP: Record<string, string> = Object.entries(TARDING_TYPE_MAP)
  .reduce((acc, [key, value]) => ({ ...acc, [value]: key }), {});

export const REVERSED_SPOT_ORDER_TYPE_MAP: Record<string, string> = Object.entries(SPOT_ORDER_TYPE_MAP)
  .reduce((acc, [key, value]) => ({ ...acc, [value]: key }), {});

export const REVERSED_SPOT_EXCHANGE_MAP: Record<string, string> = Object.entries(SPOT_EXCHANGE_MAP)
  .reduce((acc, [key, value]) => ({ ...acc, [value]: key }), {});

export const GenerateSpotMemo = ({ limit, buy, symbol, exchange, price }: { limit: boolean, buy: boolean, symbol: string, exchange: string, price?: string }) => {
  let finalSymbol = symbol;
  if (symbol.endsWith('USDT')) {
    finalSymbol = `${symbol}-ERC20`
  }
  const tradingType = 'SP'
  const spotOrderType = limit ? (buy ? 'LB' : 'LS') : (buy ? 'MB' : 'MS');
  const exchangeId = REVERSED_SPOT_EXCHANGE_MAP[exchange.toLowerCase()];
  if (!exchange) {
    console.error(`GenerateSpotMemo failed to get exchange:${exchange}`);
    return;
  }
  const pairId = PAIRS_MAP_REVERSED[finalSymbol]
  if (!pairId) {
    console.error(`GenerateSpotMemo failed to get pairId for symbol:${symbol}`)
    return;
  }
  const limitPriceOrRefId = price || '0';
  const refId = '';

  const memo = `${tradingType}:${spotOrderType}:${exchangeId}:${pairId}:${limitPriceOrRefId}:${refId}`
  return Buffer.from(memo, 'binary').toString('base64').replaceAll('=', '');
}

export const GenerateArbitrageMemo = ({
  action,
  exchangeA,
  exchangeB,
  symbol,
  orderId,
}:{
  action: string
  exchangeA: string
  exchangeB: string
  symbol: string
  orderId: string
}) => {
  const tradingType = 'AR';
  const actionCode = action; // CR/DE/WI - Create/Deposit/Withdraw
  const exchangeAId = REVERSED_SPOT_EXCHANGE_MAP[exchangeA.toLowerCase()];
  const exchangeBId = REVERSED_SPOT_EXCHANGE_MAP[exchangeB.toLowerCase()];
  if (!exchangeAId || !exchangeBId) {
    console.error(`GenerateArbitrageMemo failed to get exchange indices for: ${exchangeA}, ${exchangeB}`);
    return;
  }
  let finalSymbol = symbol;
  if (symbol.endsWith('USDT')) {
    finalSymbol = `${symbol}-ERC20`
  }
  const symbolKey = PAIRS_MAP_REVERSED[finalSymbol];
  if (!symbolKey) {
    console.error(`GenerateArbitrageMemo failed to get symbol key for: ${finalSymbol}`);
    return;
  }

  const memo = `${tradingType}:${actionCode}:${exchangeAId}:${exchangeBId}:${symbolKey}:${orderId}`;
  return Buffer.from(memo, 'binary').toString('base64').replaceAll('=', '');
};

export const GenerateMarketMakingMemo = ({
  action,
  exchange,
  symbol,
  orderId,
}:{
  action: string
  exchange: string
  symbol: string
  orderId: string
}) => {
  const tradingType = 'MM';
  const actionCode = action; // CR/DE/WI - Create/Deposit/Withdraw
  const exchangeId = REVERSED_SPOT_EXCHANGE_MAP[exchange.toLowerCase()];
  if (!exchangeId) {
    console.error(`GenerateMarketMakingMemo failed to get exchange index for: ${exchange}`);
    return;
  }
  let finalSymbol = symbol;
  if (symbol.endsWith('USDT')) {
    finalSymbol = `${symbol}-ERC20`
  }
  const symbolKey = PAIRS_MAP_REVERSED[finalSymbol];
  if (!symbolKey) {
    console.error(`GenerateMarketMakingMemo failed to get symbol key for: ${symbol}`);
    return;
  }

  const memo = `${tradingType}:${actionCode}:${exchangeId}:${symbolKey}:${orderId}`;
  return Buffer.from(memo, 'binary').toString('base64').replaceAll('=', '');
};
