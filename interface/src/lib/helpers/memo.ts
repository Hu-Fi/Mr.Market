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

export const GenerateArbitrageMemo = () => {
  // 1. AB (Memo Type)
  // 2. CR/DE/WI (Transfer Type) (Create/Deposit/Withdraw)
  // 3. 01 (Exchange0 index) (binance)
  // 4. 02 (Exchange1 index) (mexc)
  // 5. Z7GC (Key of the arbitrage pair) (BTC/USDT)
}

export const GenerateMarketMakingMemo = () => {
  // 1. MM (Memo Type)
  // 2. CR/DE/WI (Transfer Type) (Create/Deposit/Withdraw)
  // 3. 01 (Exchange index) (okx)
  // 4. Z7GC (Key of the market making pair)
}