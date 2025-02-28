import {
  TARDING_TYPE_MAP,
  ARBITRAGE_MEMO_ACTION_MAP,
  MARKET_MAKING_MEMO_ACTION_MAP,
  SIMPLY_GROW_MEMO_ACTION_MAP,
  SPOT_ORDER_TYPE_MAP,
  SPOT_ACTION_TYPE_MAP,
} from 'src/common/constants/memo';
import {
  ArbitrageCreateMemoDetails,
  MarketMakingCreateMemoDetails,
  SimplyGrowCreateMemoDetails,
  SpotLimitMemoDetails,
  SpotMarketMemoDetails,
} from 'src/common/types/memo/memo';
import { base58, getAddress } from 'ethers/lib/utils';
import { createHash } from 'crypto';

export const computeMemoChecksum = (buffer: Buffer): Buffer => {
  const hash = createHash('sha256').update(buffer).digest();
  return createHash('sha256').update(hash).digest().subarray(0, 4);
};

function bufferToUuid(buffer: Buffer): string {
  const hex = buffer.toString('hex');
  return [
    hex.substring(0, 8),
    hex.substring(8, 12),
    hex.substring(12, 16),
    hex.substring(16, 20),
    hex.substring(20, 32),
  ].join('-');
}

export const memoPreDecode = (
  memo: string,
): {
  payload: Buffer;
  version: number;
  tradingTypeKey: number;
  actionKey: number;
} => {
  // Base58 decode memo
  const completeBuffer = base58.decode(memo);

  // Separate the payload and checksum
  const checksumLength = 4;
  const payloadLength = completeBuffer.length - checksumLength;
  const payload = Buffer.from(completeBuffer.slice(0, payloadLength));
  const checksum = Buffer.from(completeBuffer.slice(payloadLength));

  // Verify checksum
  const computedChecksum = computeMemoChecksum(payload);
  if (!checksum.equals(computedChecksum)) {
    throw new Error('Invalid checksum');
  }

  // Version (1 byte)
  const version = payload.readUInt8(0);

  // TradingTypeKey (1 byte)
  const tradingTypeKey = payload.readUInt8(1);
  if (version === undefined || tradingTypeKey === undefined) {
    throw new Error('Invalid memo details');
  }

  // ActionKey (1 byte)
  const actionKey = payload.readUInt8(2);

  return { payload, version, tradingTypeKey, actionKey };
};

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

export const encodeArbitrageCreateMemo = (
  details: ArbitrageCreateMemoDetails,
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
  details: MarketMakingCreateMemoDetails,
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

export const decodeSpotLimitOrderMemo = (
  payload: Buffer,
): SpotLimitMemoDetails => {
  let offset = 0;

  // Version (1 byte)
  const version = payload.readUInt8(offset);
  offset += 1;

  // TradingTypeKey (1 byte)
  const tradingTypeKey = payload.readUInt8(offset);
  offset += 1;

  // SpotOrderTypeKey (1 byte)
  const spotOrderTypeKey = payload.readUInt8(offset);
  offset += 1;

  // ActionTypeKey (1 byte)
  const actionTypeKey = payload.readUInt8(offset);
  offset += 1;

  // TradingPairIdBuffer (16 bytes for UUID)
  const tradingPairIdBuffer = payload.subarray(offset, offset + 16);
  offset += 16;
  const tradingPairId = bufferToUuid(tradingPairIdBuffer);

  // Divider (1 byte)
  const divider = payload.readUInt8(offset);
  offset += 1;
  if (divider !== 0x7c) {
    throw new Error('Invalid format for limit order');
  }

  // LimitPriceBuffer
  const limitPriceBuffer = payload.subarray(offset);
  const limitPrice = limitPriceBuffer.toString();

  // Map keys to their string values
  const tradingType = TARDING_TYPE_MAP[tradingTypeKey];
  const spotOrderType = SPOT_ORDER_TYPE_MAP[spotOrderTypeKey];
  const action = SPOT_ACTION_TYPE_MAP[actionTypeKey];

  return {
    version,
    tradingType,
    spotOrderType,
    action,
    tradingPairId,
    limitPrice,
  };
};

export const decodeSpotMarketOrderMemo = (
  payload: Buffer,
): SpotMarketMemoDetails => {
  // Memo is base58 decoded, now parse the payload
  let offset = 0;

  // Version (1 byte)
  const version = payload.readUInt8(offset);
  offset += 1;

  // TradingTypeKey (1 byte)
  const tradingTypeKey = payload.readUInt8(offset);
  offset += 1;

  // SpotOrderTypeKey (1 byte)
  const spotOrderTypeKey = payload.readUInt8(offset);
  offset += 1;

  // ActionTypeKey (1 byte)
  const actionTypeKey = payload.readUInt8(offset);
  offset += 1;

  // TradingPairIdBuffer (16 bytes for UUID)
  const tradingPairIdBuffer = payload.subarray(offset, offset + 16);
  offset += 16;
  const tradingPairId = bufferToUuid(tradingPairIdBuffer);

  // Map keys to their string values
  const tradingType = TARDING_TYPE_MAP[tradingTypeKey];
  const spotOrderType = SPOT_ORDER_TYPE_MAP[spotOrderTypeKey];
  const action = SPOT_ACTION_TYPE_MAP[actionTypeKey];

  return {
    version,
    tradingType,
    spotOrderType,
    action,
    tradingPairId,
  };
};

export const decodeSimplyGrowCreateMemo = (
  payload: Buffer,
): SimplyGrowCreateMemoDetails => {
  // Memo is base58 decoded, now parse the payload
  let offset = 0;

  // Version (1 byte)
  const version = payload.readUInt8(offset);
  offset += 1;

  // TradingTypeKey (1 byte)
  const tradingTypeKey = payload.readUInt8(offset);
  offset += 1;

  // ActionKey (1 byte)
  const actionKey = payload.readUInt8(offset);
  offset += 1;

  // OrderIdBuffer (16 bytes for UUID)
  const orderIdBuffer = payload.subarray(offset, offset + 16);
  offset += 16;
  const orderId = bufferToUuid(orderIdBuffer);

  // RewardAddressBuffer (remaining bytes)
  const rewardAddressBuffer = payload.subarray(offset);
  const rewardAddress = getAddress(`0x${rewardAddressBuffer.toString('hex')}`);

  // Map tradingTypeKey and actionKey back to their values
  const tradingType = TARDING_TYPE_MAP[tradingTypeKey];
  const action = SIMPLY_GROW_MEMO_ACTION_MAP[actionKey];

  if (tradingType === undefined || action === undefined) {
    throw new Error('Invalid tradingType or action');
  }

  // Construct the SimplyGrowCreateMemoDetails object
  const details: SimplyGrowCreateMemoDetails = {
    version,
    tradingType,
    action,
    orderId,
    rewardAddress,
  };

  return details;
};

export const decodeArbitrageCreateMemo = (
  payload: Buffer,
): ArbitrageCreateMemoDetails => {
  // Memo is base58 decoded, now parse the payload
  let offset = 0;

  // Version (1 byte)
  const version = payload.readUInt8(offset);
  offset += 1;

  // TradingTypeKey (1 byte)
  const tradingTypeKey = payload.readUInt8(offset);
  offset += 1;

  // ActionKey (1 byte)
  const actionKey = payload.readUInt8(offset);
  offset += 1;

  // ArbitragePairIdBuffer (16 bytes for UUID)
  const arbitragePairIdBuffer = payload.subarray(offset, offset + 16);
  offset += 16;
  const arbitragePairId = bufferToUuid(arbitragePairIdBuffer);

  // OrderIdBuffer (16 bytes for UUID)
  const orderIdBuffer = payload.subarray(offset, offset + 16);
  offset += 16;
  const orderId = bufferToUuid(orderIdBuffer);

  // RewardAddressBuffer (remaining bytes)
  const rewardAddressBuffer = payload.subarray(offset);
  // Convert to Ethereum address
  const rewardAddress = getAddress(`0x${rewardAddressBuffer.toString('hex')}`);

  // Map tradingTypeKey and actionKey back to their values
  const tradingType = TARDING_TYPE_MAP[tradingTypeKey];
  const action = ARBITRAGE_MEMO_ACTION_MAP[actionKey];

  if (tradingType === undefined || action === undefined) {
    throw new Error('Invalid tradingType or action');
  }

  // Construct the ArbitrageCreateMemoDetails object
  const details: ArbitrageCreateMemoDetails = {
    version,
    tradingType,
    action,
    arbitragePairId,
    orderId,
    rewardAddress,
  };

  return details;
};

export const decodeMarketMakingCreateMemo = (
  payload: Buffer,
): MarketMakingCreateMemoDetails => {
  // Memo is base58 decoded, now parse the payload
  let offset = 0;

  // Version (1 byte)
  const version = payload.readUInt8(offset);
  offset += 1;

  // TradingTypeKey (1 byte)
  const tradingTypeKey = payload.readUInt8(offset);
  offset += 1;

  // ActionKey (1 byte)
  const actionKey = payload.readUInt8(offset);
  offset += 1;

  // MarketMakingPairIdBuffer (16 bytes for UUID)
  const marketMakingPairIdBuffer = payload.subarray(offset, offset + 16);
  offset += 16;
  const marketMakingPairId = bufferToUuid(marketMakingPairIdBuffer);

  // OrderIdBuffer (16 bytes for UUID)
  const orderIdBuffer = payload.subarray(offset, offset + 16);
  offset += 16;
  const orderId = bufferToUuid(orderIdBuffer);

  // RewardAddressBuffer (remaining bytes)
  const rewardAddressBuffer = payload.subarray(offset);
  const rewardAddress = getAddress(`0x${rewardAddressBuffer.toString('hex')}`);

  // Map tradingTypeKey and actionKey back to their values
  const tradingType = TARDING_TYPE_MAP[tradingTypeKey];
  const action = MARKET_MAKING_MEMO_ACTION_MAP[actionKey];

  if (tradingType === undefined || action === undefined) {
    throw new Error('Invalid tradingType or action');
  }

  // Construct the MarketMakingCreateMemoDetails object
  const details: MarketMakingCreateMemoDetails = {
    version,
    tradingType,
    action,
    marketMakingPairId,
    orderId,
    rewardAddress,
  };

  return details;
};
