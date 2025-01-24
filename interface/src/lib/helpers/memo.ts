import { createHash } from "crypto";
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
  1: 'limit',
  2: 'market',
};

export const SPOT_ACTION_TYPE_MAP: Record<string, string> = {
  1: 'buy',
  2: 'sell',
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

export const encodeSpotLimitOrderMemo = (details: {
  version: number;
  tradingType: string;
  spotOrderType: string;
  action: string;
  tradingPairId: string;
  limitPrice: string;
}): string => {
  const tradingTypeKey = Number(
    Object.keys(TARDING_TYPE_MAP).find(
      (key) => TARDING_TYPE_MAP[key] === details.tradingType,
    ),
  );
  const actionKey = Number(
    Object.keys(SPOT_ACTION_TYPE_MAP).find(
      (key) => SPOT_ACTION_TYPE_MAP[key] === details.action,
    ),
  );
  const spotOrderTypeKey = Number(
    Object.keys(SPOT_ORDER_TYPE_MAP).find(
      (key) => SPOT_ORDER_TYPE_MAP[key] === details.spotOrderType,
    ),
  );
  if (
    tradingTypeKey === undefined ||
    actionKey === undefined ||
    spotOrderTypeKey === undefined
  ) {
    throw new Error('Invalid memo details');
  }

  const versionBuffer = Buffer.from([details.version]);
  const tradingTypeBuffer = Buffer.from([tradingTypeKey]);
  const spotOrderTypeBuffer = Buffer.from([spotOrderTypeKey]);
  const actionBuffer = Buffer.from([actionKey]);
  const tradingPairIdBuffer = Buffer.from(
    details.tradingPairId.replace(/-/g, ''),
    'hex',
  );
  const limitPriceBuffer = Buffer.from(details.limitPrice);

  const payload = Buffer.concat([
    versionBuffer,
    tradingTypeBuffer,
    spotOrderTypeBuffer,
    actionBuffer,
    tradingPairIdBuffer,
    Buffer.from([0x7c]), // '|' as a divider
    limitPriceBuffer,
  ]);

  const checksum = computeMemoChecksum(payload);
  const completeBuffer = Buffer.concat([payload, checksum]);
  return base58.encode(completeBuffer);
};

export const encodeSpotMarketOrderMemo = (details: {
  version: number;
  tradingType: string;
  spotOrderType: string;
  action: string;
  tradingPairId: string;
}): string => {
  const tradingTypeKey = Number(
    Object.keys(TARDING_TYPE_MAP).find(
      (key) => TARDING_TYPE_MAP[key] === details.tradingType,
    ),
  );

  const spotOrderTypeKey = Number(
    Object.keys(SPOT_ORDER_TYPE_MAP).find(
      (key) => SPOT_ORDER_TYPE_MAP[key] === details.spotOrderType,
    ),
  );

  const actionKey = Number(
    Object.keys(SPOT_ACTION_TYPE_MAP).find(
      (key) => SPOT_ACTION_TYPE_MAP[key] === details.action,
    ),
  );

  if (
    tradingTypeKey === undefined ||
    spotOrderTypeKey === undefined ||
    actionKey === undefined
  ) {
    throw new Error('Invalid memo details');
  }

  const versionBuffer = Buffer.from([details.version]);
  const tradingTypeBuffer = Buffer.from([tradingTypeKey]);
  const spotOrderTypeBuffer = Buffer.from([spotOrderTypeKey]);
  const actionBuffer = Buffer.from([actionKey]);
  const tradingPairIdBuffer = Buffer.from(
    details.tradingPairId.replace(/-/g, ''),
    'hex',
  );

  const payload = Buffer.concat([
    versionBuffer,
    tradingTypeBuffer,
    spotOrderTypeBuffer,
    actionBuffer,
    tradingPairIdBuffer,
  ]);

  const checksum = computeMemoChecksum(payload);
  const completeBuffer = Buffer.concat([payload, checksum]);
  return base58.encode(completeBuffer);
};

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

export const encodeSimplyGrowDepositMemo = (
  details: {
    version: number;
    tradingType: string;
    action: string;
    orderId: string;
    rewardAddress: string;
  },
): string => {
  // Placeholder
  const memo = `${details.tradingType}:${details.action}:${details.orderId}:${details.rewardAddress}`
  return Buffer.from(memo, 'binary').toString('base64').replaceAll('=', '');
}

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

export const encodeArbitrageDepositMemo = (
  details: {
    version: number;
    tradingType: string;
    action: string;
    arbitragePairId: string;
    orderId: string;
    rewardAddress: string;
  },
): string => {
  // Placeholder
  const memo = `${details.tradingType}:${details.action}:${details.arbitragePairId}:${details.orderId}:${details.rewardAddress}`
  return Buffer.from(memo, 'binary').toString('base64').replaceAll('=', '');
}

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

export const encodeMarketMakingDepositMemo = (
  details: {
    version: number;
    tradingType: string;
    action: string;
    marketMakingPairId: string;
    orderId: string;
    rewardAddress: string;
  },
): string => {
  // Placeholder
  const memo = `${details.tradingType}:${details.action}:${details.marketMakingPairId}:${details.orderId}:${details.rewardAddress}`
  return Buffer.from(memo, 'binary').toString('base64').replaceAll('=', '');
}

export const GenerateSpotTradingMemo = ({ limit, buy, symbol, exchange, price }: { limit: boolean, buy: boolean, symbol: string, exchange: string, price?: string }) => {
  console.log('GenerateSpotTradingMemo', limit, buy, symbol, exchange, price)
}

function computeMemoChecksum(buffer: Buffer): Buffer {
  const hash = createHash('sha256').update(buffer).digest();
  return createHash('sha256').update(hash).digest().subarray(0, 4);
}