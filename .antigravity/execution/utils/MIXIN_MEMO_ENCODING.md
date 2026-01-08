# Mixin Memo Encoding Guide

## Overview

Mixin Network uses **memos** (also called transaction notes) to attach metadata to cryptocurrency transfers. In the Mr.Market application, memos encode structured information about trading operations (Market Making, Arbitrage, Simply Grow) in a compact, binary format that is then Base58-encoded for transmission.

This document explains how memos are generated, encoded, decoded, and validated.

## Why Use Binary Encoding?

### Advantages
- **Compact Size**: Binary encoding is much smaller than JSON or plain text
- **Efficiency**: Reduces transaction costs and network overhead
- **Type Safety**: Fixed-width fields prevent ambiguity
- **Integrity**: Built-in checksum validation prevents corruption
- **Privacy**: Not human-readable without decoding logic

### Use Cases in Mr.Market
1. **Market Making Orders**: Encode pair ID and order ID for tracking
2. **Arbitrage Orders**: Encode arbitrage pair, order, and reward address
3. **Simply Grow Orders**: Encode order ID for investment tracking

## Memo Structure

All memos follow this general structure:

```
┌─────────────┬──────────────┬─────────┬────────────────┬──────────┐
│   Version   │ Trading Type │ Action  │   Payload      │ Checksum │
│   (1 byte)  │   (1 byte)   │(1 byte) │  (variable)    │ (4 bytes)│
└─────────────┴──────────────┴─────────┴────────────────┴──────────┘
```

### Common Fields

| Field | Size | Type | Description |
|-------|------|------|-------------|
| **Version** | 1 byte | uint8 | Memo format version (currently `1`) |
| **Trading Type** | 1 byte | uint8 | Type of trading operation |
| **Action** | 1 byte | uint8 | Action being performed |
| **Payload** | Variable | Binary | Operation-specific data |
| **Checksum** | 4 bytes | Binary | SHA256 double-hash checksum |

## Encoding Maps

### Trading Type Map

```typescript
TARDING_TYPE_MAP = {
  0: 'Spot',
  1: 'Market Making',
  2: 'Simply Grow',
}
```

### Action Maps

#### Market Making Actions
```typescript
MARKET_MAKING_MEMO_ACTION_MAP = {
  1: 'create',
  2: 'deposit',
}
```

#### Arbitrage Actions
```typescript
ARBITRAGE_MEMO_ACTION_MAP = {
  1: 'create',
  2: 'deposit',
}
```

#### Simply Grow Actions
```typescript
SIMPLY_GROW_MEMO_ACTION_MAP = {
  1: 'create',
  2: 'deposit',
}
```

## Memo Types

### 1. Market Making Create Memo

**Purpose**: Create a new market making order

**Structure**:
```
┌─────────┬──────────────┬────────┬──────────────────────┬──────────────┬──────────┐
│ Version │ Trading Type │ Action │ Market Making Pair ID│   Order ID   │ Checksum │
│ 1 byte  │   1 byte     │ 1 byte │      16 bytes        │   16 bytes   │ 4 bytes  │
└─────────┴──────────────┴────────┴──────────────────────┴──────────────┴──────────┘
```

**Total Size**: 39 bytes (before Base58 encoding)

**Fields**:
- **Version**: `1`
- **Trading Type**: `1` (Market Making)
- **Action**: `1` (create)
- **Market Making Pair ID**: UUID (16 bytes binary, no hyphens)
- **Order ID**: UUID (16 bytes binary, no hyphens)
- **Checksum**: First 4 bytes of double SHA256 hash

**Example**:
```typescript
const memo = encodeMarketMakingCreateMemo({
  version: 1,
  tradingType: 'Market Making',
  action: 'create',
  marketMakingPairId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  orderId: '12345678-90ab-cdef-1234-567890abcdef',
});
// Returns: Base58-encoded string like "3kJ8h9F2mN..."
```

### 2. Arbitrage Create Memo

**Purpose**: Create a new arbitrage order

**Structure**:
```
┌─────────┬──────────────┬────────┬──────────────────┬──────────────┬────────────────┬──────────┐
│ Version │ Trading Type │ Action │ Arbitrage Pair ID│   Order ID   │ Reward Address │ Checksum │
│ 1 byte  │   1 byte     │ 1 byte │    16 bytes      │   16 bytes   │   20 bytes     │ 4 bytes  │
└─────────┴──────────────┴────────┴──────────────────┴──────────────┴────────────────┴──────────┘
```

**Total Size**: 59 bytes (before Base58 encoding)

**Fields**:
- **Version**: `1`
- **Trading Type**: `0` (Spot) - Arbitrage uses spot trading
- **Action**: `1` (create)
- **Arbitrage Pair ID**: UUID (16 bytes binary)
- **Order ID**: UUID (16 bytes binary)
- **Reward Address**: Ethereum address (20 bytes binary, no `0x` prefix)
- **Checksum**: First 4 bytes of double SHA256 hash

**Example**:
```typescript
const memo = encodeArbitrageCreateMemo({
  version: 1,
  tradingType: 'Spot',
  action: 'create',
  arbitragePairId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  orderId: '12345678-90ab-cdef-1234-567890abcdef',
  rewardAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
});
// Returns: Base58-encoded string
```

### 3. Simply Grow Create Memo

**Purpose**: Create a new Simply Grow investment order

**Structure**:
```
┌─────────┬──────────────┬────────┬──────────────┬──────────┐
│ Version │ Trading Type │ Action │   Order ID   │ Checksum │
│ 1 byte  │   1 byte     │ 1 byte │   16 bytes   │ 4 bytes  │
└─────────┴──────────────┴────────┴──────────────┴──────────┘
```

**Total Size**: 23 bytes (before Base58 encoding)

**Fields**:
- **Version**: `1`
- **Trading Type**: `2` (Simply Grow)
- **Action**: `1` (create)
- **Order ID**: UUID (16 bytes binary)
- **Checksum**: First 4 bytes of double SHA256 hash

**Example**:
```typescript
const memo = encodeSimplyGrowCreateMemo({
  version: 1,
  tradingType: 'Simply Grow',
  action: 'create',
  orderId: '12345678-90ab-cdef-1234-567890abcdef',
});
// Returns: Base58-encoded string
```

## Encoding Process

### Step-by-Step Encoding

```typescript
function encodeMarketMakingCreateMemo(details) {
  // 1. Convert string values to numeric keys
  const tradingTypeKey = 1; // 'Market Making'
  const actionKey = 1;       // 'create'

  // 2. Create binary buffers for each field
  const versionBuffer = Buffer.from([details.version]);
  const tradingTypeBuffer = Buffer.from([tradingTypeKey]);
  const actionBuffer = Buffer.from([actionKey]);
  
  // 3. Convert UUIDs to binary (remove hyphens, parse as hex)
  const marketMakingPairIdBuffer = Buffer.from(
    details.marketMakingPairId.replace(/-/g, ''),
    'hex'
  );
  const orderIdBuffer = Buffer.from(
    details.orderId.replace(/-/g, ''),
    'hex'
  );

  // 4. Concatenate all fields into payload
  const payload = Buffer.concat([
    versionBuffer,
    tradingTypeBuffer,
    actionBuffer,
    marketMakingPairIdBuffer,
    orderIdBuffer,
  ]);

  // 5. Compute checksum (double SHA256, first 4 bytes)
  const checksum = computeMemoChecksum(payload);

  // 6. Concatenate payload + checksum
  const completeBuffer = Buffer.concat([payload, checksum]);

  // 7. Base58 encode the complete buffer
  return base58.encode(completeBuffer);
}
```

### Checksum Calculation

The checksum ensures data integrity during transmission:

```typescript
function computeMemoChecksum(buffer: Buffer): Buffer {
  // First SHA256 hash
  const hash1 = createHash('sha256')
    .update(buffer)
    .digest();
  
  // Second SHA256 hash (double hash)
  const hash2 = createHash('sha256')
    .update(hash1)
    .digest();
  
  // Return first 4 bytes
  return hash2.subarray(0, 4);
}
```

**Why Double SHA256?**
- Used in Bitcoin and many cryptocurrencies
- Provides extra protection against length extension attacks
- Industry-standard approach for checksums

## Decoding Process

### Step-by-Step Decoding

```typescript
function decodeMarketMakingCreateMemo(memo: string) {
  // 1. Base58 decode
  const completeBuffer = base58.decode(memo);

  // 2. Separate payload and checksum
  const checksumLength = 4;
  const payloadLength = completeBuffer.length - checksumLength;
  const payload = completeBuffer.slice(0, payloadLength);
  const checksum = completeBuffer.slice(payloadLength);

  // 3. Verify checksum
  const computedChecksum = computeMemoChecksum(payload);
  if (!checksum.equals(computedChecksum)) {
    throw new Error('Invalid checksum - memo corrupted');
  }

  // 4. Parse fields
  let offset = 0;
  
  const version = payload.readUInt8(offset);
  offset += 1;
  
  const tradingTypeKey = payload.readUInt8(offset);
  offset += 1;
  
  const actionKey = payload.readUInt8(offset);
  offset += 1;
  
  const marketMakingPairIdBuffer = payload.subarray(offset, offset + 16);
  offset += 16;
  const marketMakingPairId = bufferToUuid(marketMakingPairIdBuffer);
  
  const orderIdBuffer = payload.subarray(offset, offset + 16);
  offset += 16;
  const orderId = bufferToUuid(orderIdBuffer);

  // 5. Map numeric keys back to strings
  const tradingType = TARDING_TYPE_MAP[tradingTypeKey];
  const action = MARKET_MAKING_MEMO_ACTION_MAP[actionKey];

  return {
    version,
    tradingType,
    action,
    marketMakingPairId,
    orderId,
  };
}
```

### UUID Conversion

```typescript
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
```

## Usage in Application

### Frontend (Creating Payment)

```typescript
// User creates a market making order
const orderId = uuidv4();
const marketMakingPairId = selectedPair.id;

// Generate memo
const memo = encodeMarketMakingCreateMemo({
  version: 1,
  tradingType: 'Market Making',
  action: 'create',
  marketMakingPairId,
  orderId,
});

// Create Mixin payment with memo
await mixinPay({
  asset_id: baseAssetId,
  amount: baseAmount,
  memo,
  trace_id: uuidv4(),
});
```

### Backend (Processing Payment)

```typescript
// Snapshot handler receives payment
async handleSnapshot(snapshot) {
  const { memo, asset_id, amount } = snapshot;
  
  // Pre-decode to identify trading type
  const { version, tradingTypeKey } = memoPreDecode(memo);
  
  if (tradingTypeKey === 1) { // Market Making
    const details = decodeMarketMakingCreateMemo(memo);
    
    // Process market making order
    await this.processMarketMakingOrder({
      marketMakingPairId: details.marketMakingPairId,
      orderId: details.orderId,
      assetId: asset_id,
      amount,
    });
  }
}
```

## Error Handling

### Common Errors

#### 1. Invalid Checksum
```typescript
// Error: Memo was corrupted during transmission
throw new Error('Invalid checksum - memo corrupted');
```

**Solution**: Request user to retry payment

#### 2. Invalid Trading Type or Action
```typescript
// Error: Unknown trading type key
throw new Error('Invalid tradingType or action');
```

**Solution**: Ensure frontend and backend use same version of encoding maps

#### 3. Invalid UUID Format
```typescript
// Error: UUID is not 36 characters with hyphens
throw new Error('Invalid UUID format');
```

**Solution**: Validate UUIDs before encoding

### Validation Best Practices

```typescript
function validateMemoDetails(details) {
  // Check version
  if (details.version !== 1) {
    throw new Error('Unsupported memo version');
  }
  
  // Validate UUIDs
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(details.orderId)) {
    throw new Error('Invalid order ID format');
  }
  
  // Validate Ethereum address (if applicable)
  if (details.rewardAddress && !details.rewardAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
    throw new Error('Invalid Ethereum address');
  }
  
  return true;
}
```

## Testing

### Unit Tests

```typescript
describe('Memo Encoding/Decoding', () => {
  it('should encode and decode Market Making memo correctly', () => {
    const original = {
      version: 1,
      tradingType: 'Market Making',
      action: 'create',
      marketMakingPairId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      orderId: '12345678-90ab-cdef-1234-567890abcdef',
    };
    
    const encoded = encodeMarketMakingCreateMemo(original);
    const decoded = decodeMarketMakingCreateMemo(encoded);
    
    expect(decoded).toEqual(original);
  });
  
  it('should reject memo with invalid checksum', () => {
    const validMemo = encodeMarketMakingCreateMemo({...});
    const corruptedMemo = validMemo.slice(0, -1) + 'X'; // Corrupt last char
    
    expect(() => decodeMarketMakingCreateMemo(corruptedMemo))
      .toThrow('Invalid checksum');
  });
  
  it('should handle all trading types', () => {
    const types = ['Spot', 'Market Making', 'Simply Grow'];
    types.forEach(type => {
      const key = Object.keys(TARDING_TYPE_MAP).find(
        k => TARDING_TYPE_MAP[k] === type
      );
      expect(key).toBeDefined();
    });
  });
});
```

### Integration Tests

```typescript
it('should process payment with encoded memo', async () => {
  // Create memo
  const memo = encodeMarketMakingCreateMemo({
    version: 1,
    tradingType: 'Market Making',
    action: 'create',
    marketMakingPairId: testPairId,
    orderId: testOrderId,
  });
  
  // Simulate payment
  const snapshot = {
    snapshot_id: uuidv4(),
    asset_id: 'test-asset-id',
    amount: '100',
    memo,
  };
  
  // Process snapshot
  await snapshotsProcessor.handleSnapshot(snapshot);
  
  // Verify order was created
  const order = await marketMakingOrderRepo.findOne({
    where: { order_id: testOrderId }
  });
  
  expect(order).toBeDefined();
  expect(order.market_making_pair_id).toBe(testPairId);
});
```

## Migration and Versioning

### Version Field Purpose

The `version` field (first byte) allows for future memo format changes:

```typescript
// Current version
const CURRENT_MEMO_VERSION = 1;

// Future: If we need to add fields
const MEMO_VERSION_2 = 2;

function decodeMemo(memo: string) {
  const { version, payload } = memoPreDecode(memo);
  
  switch (version) {
    case 1:
      return decodeV1Memo(payload);
    case 2:
      return decodeV2Memo(payload); // Future version
    default:
      throw new Error(`Unsupported memo version: ${version}`);
  }
}
```

### Backward Compatibility

When updating memo format:
1. Increment version number
2. Keep old decoders for backward compatibility
3. Update frontend to use new version
4. Monitor logs for old version usage
5. Deprecate old versions after grace period

## Security Considerations

### 1. Checksum Validation
Always validate checksum before processing:
```typescript
if (!checksum.equals(computedChecksum)) {
  logger.error('Invalid memo checksum', { memo });
  throw new Error('Memo validation failed');
}
```

### 2. Input Sanitization
Validate all inputs before encoding:
```typescript
// Prevent injection attacks
const sanitizedOrderId = orderId.replace(/[^a-f0-9-]/gi, '');
if (sanitizedOrderId !== orderId) {
  throw new Error('Invalid characters in order ID');
}
```

### 3. Rate Limiting
Implement rate limiting for memo processing to prevent spam:
```typescript
// Limit memo processing per user
const rateLimiter = new RateLimiter({
  maxRequests: 10,
  windowMs: 60000, // 1 minute
});
```

### 4. Logging
Log all memo operations for audit trail:
```typescript
logger.info('Memo encoded', {
  tradingType: details.tradingType,
  action: details.action,
  orderId: details.orderId,
  memoLength: memo.length,
});
```

## Performance Optimization

### 1. Caching
Cache frequently used encoding maps:
```typescript
const encodingCache = new Map();

function getCachedTradingTypeKey(tradingType: string): number {
  if (!encodingCache.has(tradingType)) {
    const key = Object.keys(TARDING_TYPE_MAP).find(
      k => TARDING_TYPE_MAP[k] === tradingType
    );
    encodingCache.set(tradingType, Number(key));
  }
  return encodingCache.get(tradingType);
}
```

### 2. Buffer Pooling
Reuse buffers for better memory efficiency:
```typescript
const bufferPool = {
  version: Buffer.allocUnsafe(1),
  tradingType: Buffer.allocUnsafe(1),
  action: Buffer.allocUnsafe(1),
};
```

## Troubleshooting

### Common Issues

| Issue | Symptom | Solution |
|-------|---------|----------|
| **Checksum mismatch** | Decoding fails | Verify encoding/decoding use same algorithm |
| **Wrong memo length** | Unexpected buffer size | Check all fields are correct size |
| **Invalid Base58** | Decode error | Ensure no invalid characters in memo |
| **UUID format error** | Parsing fails | Validate UUID format before encoding |
| **Version mismatch** | Unknown version error | Update decoder to support new version |

### Debug Logging

```typescript
function debugMemo(memo: string) {
  const buffer = base58.decode(memo);
  console.log('Memo length:', memo.length);
  console.log('Buffer length:', buffer.length);
  console.log('Buffer hex:', buffer.toString('hex'));
  console.log('Version:', buffer.readUInt8(0));
  console.log('Trading Type:', buffer.readUInt8(1));
  console.log('Action:', buffer.readUInt8(2));
}
```

## Summary

### Key Takeaways

✅ **Binary Encoding**: Compact, efficient, and type-safe  
✅ **Checksum Validation**: Ensures data integrity  
✅ **Base58 Encoding**: Human-readable transmission format  
✅ **Versioning**: Supports future format changes  
✅ **Type Safety**: Fixed-width fields prevent errors  
✅ **Security**: Built-in validation and error handling  

### Best Practices

1. **Always validate** checksums before processing
2. **Use version field** for future compatibility
3. **Log all operations** for debugging and auditing
4. **Test thoroughly** with unit and integration tests
5. **Handle errors gracefully** with clear error messages
6. **Document changes** when updating memo format

---

**Created**: 2026-01-02  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
