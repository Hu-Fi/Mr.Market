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

export const ARBITRAGE_MEMO_ACTION_MAP: Record<string, string> = {
  1: 'create',
  2: 'deposit',
};

export const MARKET_MAKING_MEMO_ACTION_MAP: Record<string, string> = {
  1: 'create',
  2: 'deposit',
};

export const SIMPLY_GROW_MEMO_ACTION_MAP: Record<string, string> = {
  1: 'create',
  2: 'deposit',
};

export const REVERSED_TARDING_TYPE_MAP: Record<string, string> = Object.entries(TARDING_TYPE_MAP)
  .reduce((acc, [key, value]) => ({ ...acc, [value]: key }), {});

export const REVERSED_SPOT_ORDER_TYPE_MAP: Record<string, string> = Object.entries(SPOT_ORDER_TYPE_MAP)
  .reduce((acc, [key, value]) => ({ ...acc, [value]: key }), {});

export const REVERSED_SPOT_EXCHANGE_MAP: Record<string, string> = Object.entries(SPOT_EXCHANGE_MAP)
  .reduce((acc, [key, value]) => ({ ...acc, [value]: key }), {});

export const encodeSimplyGrowCreateMemo = (details: {
  version: number;
  tradingType: string;
  action: string;
  orderId: string;
  rewardAddress: string;
}): string => {
  // Get numeric keys for tradingType and action
  const tradingTypeKey = Number(
    Object.keys(TARDING_TYPE_MAP).find(
      (key) => TARDING_TYPE_MAP[key] === details.tradingType,
    ),
  );
  const actionKey = Number(
    Object.keys(SIMPLY_GROW_MEMO_ACTION_MAP).find(
      (key) => SIMPLY_GROW_MEMO_ACTION_MAP[key] === details.action,
    ),
  );

  if (tradingTypeKey === undefined || actionKey === undefined) {
    throw new Error('Invalid memo details');
  }

  // Serialize fields into binary
  const versionBuffer = Buffer.from([details.version]);
  const tradingTypeBuffer = Buffer.from([tradingTypeKey]);
  const actionBuffer = Buffer.from([actionKey]);

  const orderIdBuffer = Buffer.from(details.orderId.replace(/-/g, ''), 'hex'); // UUID as binary
  const rewardAddressBuffer = Buffer.from(
    details.rewardAddress.replace(/^0x/, ''),
    'hex',
  ); // Ethereum address as binary

  // Concatenate all parts
  const payload = Buffer.concat([
    versionBuffer,
    tradingTypeBuffer,
    actionBuffer,
    orderIdBuffer,
    rewardAddressBuffer,
  ]);

  // Compute checksum
  const checksum = computeMemoChecksum(payload);

  // Concatenate payload and checksum
  const completeBuffer = Buffer.concat([payload, checksum]);
  return base58.encode(completeBuffer);
};

export const encodeArbitrageCreateMemo = (
  details: {
    version: number
    tradingType: string
    action: string
    arbitragePairId: string
    orderId: string
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
  const orderIdBuffer = Buffer.from(details.orderId.replace(/-/g, ''), 'hex'); // UUID as binary
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
    orderIdBuffer,
    rewardAddressBuffer,
  ]);

  // Compute checksum
  const checksum = computeMemoChecksum(payload);

  // Concatenate payload and checksum
  const completeBuffer = Buffer.concat([payload, checksum]);
  return base58.encode(completeBuffer);
};

export const encodeMarketMakingCreateMemo = (
  details: {
    version: number;
    tradingType: string;
    action: string;
    marketMakingPairId: string;
    orderId: string;
    rewardAddress: string;
  },
): string => {
  // Get numeric keys for tradingType and action
  const tradingTypeKey = Number(
    Object.keys(TARDING_TYPE_MAP).find(
      (key) => TARDING_TYPE_MAP[key] === details.tradingType,
    ),
  );
  const actionKey = Number(
    Object.keys(MARKET_MAKING_MEMO_ACTION_MAP).find(
      (key) => MARKET_MAKING_MEMO_ACTION_MAP[key] === details.action,
    ),
  );

  if (tradingTypeKey === undefined || actionKey === undefined) {
    throw new Error('Invalid memo details');
  }

  // Serialize fields into binary
  const versionBuffer = Buffer.from([details.version]);
  const tradingTypeBuffer = Buffer.from([tradingTypeKey]);
  const actionBuffer = Buffer.from([actionKey]);

  const marketMakingPairIdBuffer = Buffer.from(
    details.marketMakingPairId.replace(/-/g, ''),
    'hex',
  ); // UUID as binary
  const orderIdBuffer = Buffer.from(details.orderId.replace(/-/g, ''), 'hex'); // UUID as binary
  const rewardAddressBuffer = Buffer.from(
    details.rewardAddress.replace(/^0x/, ''),
    'hex',
  ); // Ethereum address as binary

  // Concatenate all parts
  const payload = Buffer.concat([
    versionBuffer,
    tradingTypeBuffer,
    actionBuffer,
    marketMakingPairIdBuffer,
    orderIdBuffer,
    rewardAddressBuffer,
  ]);

  // Compute checksum
  const checksum = computeMemoChecksum(payload);

  // Concatenate payload and checksum
  const completeBuffer = Buffer.concat([payload, checksum]);
  return base58.encode(completeBuffer);
};
