import { createHash } from "crypto";
import { PAIRS_MAP_REVERSED } from "./constants";
import base58 from "bs58";

// related to 
// /server/src/common/helpers/mixin/memo.ts
// /server/src/common/constants/memo.ts
export const TARDING_TYPE_MAP: Record<string, string> = {
  0: 'Spot',
  1: 'Swap',
  2: 'Simply Grow',
  3: 'Market Making',
  4: 'Arbitrage',
  5: 'Leverage',
  6: 'Perpetual',
};

export const SPOT_ORDER_TYPE_MAP: Record<string, string> = {
  0: 'Limit Buy',
  1: 'Limit Sell',
  2: 'Market Buy',
  3: 'Market Sell',
};

export const SPOT_EXCHANGE_MAP: Record<string, string> = {
  1: 'binance',
  2: 'bitfinex',
  3: 'mexc',
  4: 'okx',
  5: 'gate',
  6: 'lbank',
};

// Decode memo for payment related actions, delete is jwt protected
export const ARBITRAGE_MEMO_ACTION_MAP: Record<string, string> = {
  1: 'create',
  2: 'deposit',
};

// Decode memo for payment related actions, delete is jwt protected
export const MARKET_MAKING_MEMO_ACTION_MAP: Record<string, string> = {
  1: 'create',
  2: 'deposit',
};

export const REVERSED_TARDING_TYPE_MAP: Record<string, string> = Object.entries(TARDING_TYPE_MAP)
  .reduce((acc, [key, value]) => ({ ...acc, [value]: key }), {});

export const REVERSED_SPOT_ORDER_TYPE_MAP: Record<string, string> = Object.entries(SPOT_ORDER_TYPE_MAP)
  .reduce((acc, [key, value]) => ({ ...acc, [value]: key }), {});

export const REVERSED_SPOT_EXCHANGE_MAP: Record<string, string> = Object.entries(SPOT_EXCHANGE_MAP)
  .reduce((acc, [key, value]) => ({ ...acc, [value]: key }), {});


export const encodeArbitrageCreateMemo = (
  details: {
    version: number
    tradingType: string
    action: string
    arbitragePairId: string
    traceId: string
    rewardAddress: string
  },
): string => {
  // Get numeric keys for tradingType and action
  const tradingTypeKey = Number(
    Object.keys(TARDING_TYPE_MAP).find(
      (key) => TARDING_TYPE_MAP[key] === details.tradingType,
    ),
  );
  const actionKey = Number(
    Object.keys(ARBITRAGE_MEMO_ACTION_MAP).find(
      (key) => ARBITRAGE_MEMO_ACTION_MAP[key] === details.action,
    ),
  );

  if (tradingTypeKey === undefined || actionKey === undefined) {
    throw new Error('Invalid memo details');
  }

  // Serialize fields into binary
  const versionBuffer = Buffer.from([details.version]);
  const tradingTypeBuffer = Buffer.from([tradingTypeKey]);
  const actionBuffer = Buffer.from([actionKey]);

  const arbitragePairIdBuffer = Buffer.from(
    details.arbitragePairId.replace(/-/g, ''),
    'hex',
  ); // UUID as binary
  const traceIdBuffer = Buffer.from(details.traceId.replace(/-/g, ''), 'hex'); // UUID as binary
  const rewardAddressBuffer = Buffer.from(
    details.rewardAddress.replace(/^0x/, ''),
    'hex',
  ); // Ethereum address as binary

  // Concatenate all parts
  const payload = Buffer.concat([
    versionBuffer,
    tradingTypeBuffer,
    actionBuffer,
    arbitragePairIdBuffer,
    traceIdBuffer,
    rewardAddressBuffer,
  ]);

  // Compute checksum
  const checksum = computeMemoChecksum(payload);

  // Concatenate payload and checksum
  const completeBuffer = Buffer.concat([payload, checksum]);
  return base58.encode(completeBuffer);
};


export const GenerateSpotTradingMemo = ({ limit, buy, symbol, exchange, price }: { limit: boolean, buy: boolean, symbol: string, exchange: string, price?: string }) => {
  let finalSymbol = symbol;
  if (symbol.endsWith('USDT')) {
    finalSymbol = `${symbol}-ERC20`
  }
  const tradingType = 'SP'
  const spotOrderType = limit ? (buy ? 'LB' : 'LS') : (buy ? 'MB' : 'MS');
  const exchangeId = REVERSED_SPOT_EXCHANGE_MAP[exchange.toLowerCase()];
  if (!exchange) {
    console.error(`GenerateSpotTradingMemo failed to get exchange:${exchange}`);
    return;
  }
  const pairId = PAIRS_MAP_REVERSED[finalSymbol]
  if (!pairId) {
    console.error(`GenerateSpotTradingMemo failed to get pairId for symbol:${symbol}`)
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

function computeMemoChecksum(buffer: Buffer): Buffer {
  const hash = createHash('sha256').update(buffer).digest();
  return createHash('sha256').update(hash).digest().subarray(0, 4);
}