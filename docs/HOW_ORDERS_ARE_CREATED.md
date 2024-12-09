# Mixin Order Processing Documentation

This document provides an overview of how Mixin orders are found and created within the system. The process involves fetching snapshots, decoding memos, and handling events to create and manage orders for different trading strategies.

## Overview

The system processes Mixin orders through the following steps:

1. **Fetching Snapshots**: Periodically fetches snapshots from the Mixin network.
2. **Decoding Memos**: Decodes the memo attached to each snapshot to determine the type of order.
3. **Event Handling**: Emits events based on the decoded memo details.
4. **Order Creation**: Listeners handle the events to create and manage orders.

## Detailed Process

### 1. Fetching Snapshots

The `SnapshotsService` is responsible for fetching snapshots from the Mixin network. This is done using a scheduled task that runs every 5 seconds, as defined by the `@Cron` decorator in the `handleSnapshots` method.

- **Method**: `fetchAndProcessSnapshots`
- **Description**: Fetches snapshots and processes each one to determine if it should be handled or refunded.

### 2. Decoding Memos

Once a snapshot is fetched, the memo attached to it is decoded to determine the type of order. The memo is decoded using the `memoPreDecode` function, which verifies the checksum and extracts the payload.

- **Method**: `handleSnapshot`
- **Description**: Decodes the memo and determines the trading type key to decide the next steps.

### 3. Event Handling

Based on the decoded memo, the system emits events corresponding to the type of order. The `handleSnapshot` method in `SnapshotsService` emits events such as `simply_grow.create`, `market_making.create`, and `arbitrage.create`.

Events:
- `simply_grow.create`
- `market_making.create`
- `arbitrage.create`
- `spot.create`

### 4. Order Creation

Listener services handle the emitted events to create and manage orders. Each listener service is responsible for a specific type of order and ensures that the event data is valid before proceeding.

#### Arbitrage Orders

- **Listener**: `ArbitrageListener`
- **Method**: `handleArbitrageCreate`
- **Description**: Validates the event data, updates payment states, and creates arbitrage orders. It checks if the asset matches the expected pair and manages the order creation process.

#### Market Making Orders

- **Listener**: `MarketMakingListener`
- **Method**: `handleMarketMakingCreate`
- **Description**: Similar to the arbitrage listener, it validates the event data, updates payment states, and creates market making orders. It ensures that the asset matches the expected pair and manages the order creation process.

#### Error Handling

- **Invalid Memos**: If a memo is invalid or cannot be decoded, the snapshot is logged and potentially refunded.
- **Missing Pairs**: If the trading pair is not found, the system logs an error and does not proceed with order creation.
- **Insufficient Funds**: If the balance is insufficient for the order, the system logs an error and does not proceed.

## Conclusion

The Mixin order processing system efficiently handles snapshots, decodes memos, and creates orders through event-driven architecture. By leveraging listeners and event emitters, the system ensures that orders are processed securely and accurately.
