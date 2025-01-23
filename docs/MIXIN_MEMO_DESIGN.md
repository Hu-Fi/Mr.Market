# Memo Design Documentation

This document provides an overview of the memo encoding and decoding system implemented in memo.ts. The memo system is designed to serialize and deserialize various types of trading-related data into a compact, binary format that can be easily transmitted, maximized the use of the available space.

## Overview

The memo system supports encoding and decoding for three main types of trading operations:

1. **Spot Order Create Memo**
2. **Simply Grow Create Memo**
3. **Arbitrage Create Memo**
4. **Market Making Create Memo**

Each type of memo is encoded into a binary format, which is then converted to a Base58 string for transmission. The memo includes a checksum to ensure data integrity.

## Encoding Process

### Common Steps

1. Mapping Keys: Each memo type uses specific mappings to convert human-readable strings (e.g., trading types, actions) into numeric keys. These mappings are defined in constant maps such as TARDING_TYPE_MAP, SIMPLY_GROW_MEMO_ACTION_MAP, etc.
2. Binary Serialization: The memo details are serialized into binary format. This includes converting UUIDs and Ethereum addresses into binary buffers.
3. Checksum Calculation: A checksum is computed using a double SHA-256 hash to ensure data integrity.
4. Base58 Encoding: The binary data, including the checksum, is encoded into a Base58 string for easy transmission.

### Spot Order Create Memo

#### Create limit order
Fields:

- Version (1 byte)
- Trading Type (1 byte, '0)
- Action (1 byte, '1' for buy, '2' for sell)
- Trading Pair ID (16 bytes, UUID in binary format)
- | (1 byte, divider)
- Limit Price (1 byte)
- | (1 byte, divider)

#### Create market order
Fields:

- Version (1 byte)
- Trading Type (1 byte)
- Action (1 byte, '1' for buy, '2' for sell)
- Trading Pair ID (16 bytes, UUID in binary format)

### Simply Grow Create Memo

Fields:

- Version (1 byte)
- Trading Type (1 byte)
- Action (1 byte)
- Order ID (16 bytes, UUID in binary format)
- Reward Address (20 bytes, Ethereum address in binary format)

Buffer Construction: Concatenates buffers for each field, computes checksum, and encodes to Base58.

### Arbitrage Create Memo

Fields:

- Version (1 byte)
- Trading Type (1 byte)
- Action (1 byte)
- Arbitrage Pair ID (16 bytes, UUID in binary format)
- Order ID (16 bytes, UUID in binary format)
- Reward Address (20 bytes, Ethereum address in binary format)

Buffer Construction: Similar to Simply Grow, but includes an additional Arbitrage Pair ID field.

### Market Making Create Memo

Fields:

- Version (1 byte)
- Trading Type (1 byte)
- Action (1 byte)
- Market Making Pair ID (16 bytes, UUID in binary format)
- Order ID (16 bytes, UUID in binary format)
- Reward Address (20 bytes, Ethereum address in binary format)

Buffer Construction: Similar to Arbitrage, but with a Market Making Pair ID field.


## Decoding Process

### Common Steps

1. Base58 Decoding: The memo string is decoded from Base58 back into a binary buffer.
2. Checksum Verification: The checksum is extracted and verified against the computed checksum to ensure data integrity.
3. Binary Deserialization: The binary data is parsed back into its original fields, using the same mappings to convert numeric keys back to human-readable strings.

### Simply Grow Create Memo

Parsing: Extracts and maps fields from the binary buffer, reconstructing the original memo details.

### Arbitrage Create Memo

Parsing: Similar to Simply Grow, but includes parsing for the Arbitrage Pair ID.

### Market Making Create Memo

Parsing: Similar to Arbitrage, but includes parsing for the Market Making Pair ID.

## Error Handling

- Invalid Details: If any field cannot be mapped back to its original value, an error is thrown.
- Checksum Mismatch: If the checksum does not match, an error is thrown indicating data corruption.

## Conclusion

The memo system provides a robust mechanism for encoding and decoding trading-related data, ensuring both compactness and integrity. By using Base58 encoding and a checksum, the system ensures that memos are both easy to transmit and reliable.
