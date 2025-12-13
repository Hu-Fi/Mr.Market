import {
  TARDING_TYPE_MAP,
  SPOT_ORDER_TYPE_MAP,
  SPOT_EXCHANGE_MAP,
  MARKET_MAKING_MEMO_ACTION_MAP,
  SIMPLY_GROW_MEMO_ACTION_MAP,
} from 'src/common/constants/memo';
import {
  ExchangeIndexValue,
  SpotMemoDetails,
  SpotOrderTypeValue,
  TradingTypeValue,
  MarketMakingCreateMemoDetails,
  SimplyGrowCreateMemoDetails,
} from 'src/common/types/memo/memo';
import { base58 } from 'ethers/lib/utils';
import { createHash } from 'crypto';

export const computeMemoChecksum = (buffer: Buffer): Buffer => {
  const hash = createHash('sha256')
    .update(buffer as unknown as Uint8Array)
    .digest();
  return createHash('sha256')
    .update(hash as unknown as Uint8Array)
    .digest()
    .subarray(0, 4);
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
    destId: destId as 'string',
    limitPrice: parts.length === 6 ? limitPriceOrRefId : undefined,
    refId: parts.length === 6 ? refId : undefined,
  };
};

export const encodeSimplyGrowCreateMemo = (details: {
  version: number;
  tradingType: string;
  action: string;
  orderId: string;
}): string => { // Remove rewardAddress argument
  // Get numeric keys for tradingType and action
  const tradingTypeKeyStr = Object.keys(TARDING_TYPE_MAP).find(
    (key) => TARDING_TYPE_MAP[key] === details.tradingType,
  );
  const actionKeyStr = Object.keys(SIMPLY_GROW_MEMO_ACTION_MAP).find(
    (key) => SIMPLY_GROW_MEMO_ACTION_MAP[key] === details.action,
  );

  if (tradingTypeKeyStr === undefined || actionKeyStr === undefined) {
    throw new Error('Invalid memo details');
  }

  const tradingTypeKey = Number(tradingTypeKeyStr);
  const actionKey = Number(actionKeyStr);

  // Serialize fields into binary
  const versionBuffer = Buffer.from([details.version]);
  const tradingTypeBuffer = Buffer.from([tradingTypeKey]);
  const actionBuffer = Buffer.from([actionKey]);

  const orderIdBuffer = Buffer.from(details.orderId.replace(/-/g, ''), 'hex'); // UUID as binary

  // Concatenate all parts
  const payload = Buffer.concat([
    versionBuffer,
    tradingTypeBuffer,
    actionBuffer,
    orderIdBuffer,
  ] as Uint8Array[]);

  // Compute checksum
  const checksum = computeMemoChecksum(payload);

  // Concatenate payload and checksum
  const completeBuffer = Buffer.concat([payload, checksum] as Uint8Array[]);
  return base58.encode(completeBuffer);
};

export const encodeMarketMakingCreateMemo = (
  details: MarketMakingCreateMemoDetails,
): string => {
  // Get numeric keys for tradingType and action
  const tradingTypeKeyStr = Object.keys(TARDING_TYPE_MAP).find(
    (key) => TARDING_TYPE_MAP[key] === details.tradingType,
  );
  const actionKeyStr = Object.keys(MARKET_MAKING_MEMO_ACTION_MAP).find(
    (key) => MARKET_MAKING_MEMO_ACTION_MAP[key] === details.action,
  );

  if (tradingTypeKeyStr === undefined || actionKeyStr === undefined) {
    throw new Error('Invalid memo details');
  }

  const tradingTypeKey = Number(tradingTypeKeyStr);
  const actionKey = Number(actionKeyStr);

  // Serialize fields into binary
  const versionBuffer = Buffer.from([details.version]);
  const tradingTypeBuffer = Buffer.from([tradingTypeKey]);
  const actionBuffer = Buffer.from([actionKey]);

  const marketMakingPairIdBuffer = Buffer.from(
    details.marketMakingPairId.replace(/-/g, ''),
    'hex',
  ); // UUID as binary
  const orderIdBuffer = Buffer.from(details.orderId.replace(/-/g, ''), 'hex'); // UUID as binary

  // Concatenate all parts
  const payload = Buffer.concat([
    versionBuffer,
    tradingTypeBuffer,
    actionBuffer,
    marketMakingPairIdBuffer,
    orderIdBuffer,
  ] as Uint8Array[]);

  // Compute checksum
  const checksum = computeMemoChecksum(payload);

  // Concatenate payload and checksum
  const completeBuffer = Buffer.concat([payload, checksum] as Uint8Array[]);
  return base58.encode(completeBuffer);
};

export const memoPreDecode = (
  memo: string,
): { payload: Buffer; version: number; tradingTypeKey: number } => {
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

  if (!version || !tradingTypeKey) {
    throw new Error('Invalid memo details');
  }

  return { payload, version, tradingTypeKey };
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
  };

  return details;
};
