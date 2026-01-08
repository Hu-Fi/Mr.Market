# Market Making Order Flow

Complete guide to how market making orders work from user payment to strategy execution.

## Quick Overview

The system processes market making orders through 9 stages using a queue-driven architecture:

```
User Transfer → Snapshot Detection → Memo Parsing → Payment Tracking → 
Payment Verification → Withdraw to Exchange → Withdrawal Confirmation → 
Join Campaign → Start Strategy → Execute Market Making Loop
```

## The 9 Stages

### Stage 1: Snapshot Polling
**File**: `src/modules/mixin/snapshots/snapshots.processor.ts`

```typescript
@Process('process_snapshots')
async handlePollSnapshots(job: Job) {
  // 1. Fetch new snapshots from Mixin API
  const snapshots = await this.snapshotsService.fetchSnapshotsOnly();
  
  // 2. Create processing task for each snapshot
  for (const snapshot of snapshots) {
    await job.queue.add('process_snapshot', snapshot, {
      jobId: snapshot.snapshot_id, // Deduplication
    });
  }
  
  // 3. Update cursor
  await this.snapshotsService.updateSnapshotCursor(snapshots[0].created_at);
  
  // 4. Poll again after 5 seconds
  await job.queue.add('process_snapshots', {}, { delay: 5000 });
}
```

**Key Points**:
- Polls every 5 seconds
- Uses snapshot_id for deduplication
- Updates cursor to avoid reprocessing

### Stage 2: Memo Parsing & Routing
**File**: `src/modules/mixin/snapshots/snapshots.service.ts`

```typescript
async handleSnapshot(snapshot: SafeSnapshot) {
  // 1. Check if it's incoming payment (amount > 0)
  if (BigNumber(snapshot.amount).isLessThanOrEqualTo(0)) {
    return; // Ignore outgoing
  }
  
  // 2. Parse memo
  const { version, tradingTypeKey, payload } = decodeMemo(memo);
  
  // 3. Route based on trading type
  if (tradingTypeKey === 1) { // Market making
    const mmDetails = decodeMarketMakingCreateMemo(payload);
    
    // Push to market-making queue
    await this.marketMakingQueue.add('process_mm_snapshot', {
      snapshotId: snapshot.snapshot_id,
      orderId: mmDetails.orderId,
      marketMakingPairId: mmDetails.marketMakingPairId,
      snapshot,
    });
  }
}
```

**Memo Structure**:
```typescript
interface MarketMakingCreateMemoDetails {
  orderId: string;              // UUID
  marketMakingPairId: string;   // UUID
}
```

### Stage 3: Payment Tracking
**File**: `src/modules/market-making/user-orders/market-making.processor.ts`

Tracks 4 types of assets:
1. **Base Asset** (e.g., BTC)
2. **Quote Asset** (e.g., USDT)
3. **Base Fee** (withdrawal fee for base)
4. **Quote Fee** (withdrawal fee for quote)

```typescript
@Process('process_mm_snapshot')
async handleProcessMMSnapshot(job: Job) {
  const { snapshotId, orderId, marketMakingPairId, snapshot } = job.data;
  
  // Step 1: Validate trading pair
  const pairConfig = await this.growDataRepository.findMarketMakingPairById(
    marketMakingPairId
  );
  
  // Step 2: Calculate required fees
  const feeInfo = await this.feeService.calculateMoveFundsFee(
    pairConfig.exchange_id,
    pairConfig.symbol,
    'deposit_to_exchange'
  );
  
  // Step 3: Find or create PaymentState
  let paymentState = await this.paymentStateRepository.findOne({
    where: { orderId }
  });
  
  if (!paymentState) {
    paymentState = this.paymentStateRepository.create({
      orderId,
      type: 'market_making',
      symbol: pairConfig.symbol,
      baseAssetId: pairConfig.base_asset_id,
      baseAssetAmount: '0',
      quoteAssetId: pairConfig.quote_asset_id,
      quoteAssetAmount: '0',
      // ... fee fields
      state: 'payment_pending',
    });
    
    // Also create MarketMakingOrder
    const mmOrder = this.marketMakingRepository.create({
      orderId,
      userId: snapshot.opponent_id,
      pair: pairConfig.symbol,
      exchangeName: pairConfig.exchange_id,
      state: 'payment_pending',
    });
    await this.marketMakingRepository.save(mmOrder);
  }
  
  // Step 4: Update amount based on received asset type
  if (receivedAssetId === pairConfig.base_asset_id) {
    paymentState.baseAssetAmount = BigNumber(paymentState.baseAssetAmount)
      .plus(receivedAmount)
      .toString();
  } else if (receivedAssetId === pairConfig.quote_asset_id) {
    paymentState.quoteAssetAmount = BigNumber(paymentState.quoteAssetAmount)
      .plus(receivedAmount)
      .toString();
  }
  // ... handle fee assets
  
  await this.paymentStateRepository.save(paymentState);
  
  // Step 5: Queue payment completion check
  await job.queue.add('check_payment_complete', {
    orderId,
    marketMakingPairId,
  }, { delay: 5000 });
}
```

### Stage 4: Payment Completion Check
**File**: `src/modules/market-making/user-orders/market-making.processor.ts`

```typescript
@Process('check_payment_complete')
async handleCheckPaymentComplete(job: Job) {
  const { orderId, retryCount = 0 } = job.data;
  
  const paymentState = await this.paymentStateRepository.findOne({
    where: { orderId }
  });
  
  // Check if all assets received
  const hasBase = BigNumber(paymentState.baseAssetAmount).isGreaterThan(0);
  const hasQuote = BigNumber(paymentState.quoteAssetAmount).isGreaterThan(0);
  const hasBaseFee = BigNumber(paymentState.baseFeeAssetAmount)
    .isGreaterThanOrEqualTo(paymentState.requiredBaseWithdrawalFee);
  const hasQuoteFee = BigNumber(paymentState.quoteFeeAssetAmount)
    .isGreaterThanOrEqualTo(paymentState.requiredQuoteWithdrawalFee);
  
  // If incomplete, retry or timeout
  if (!hasBase || !hasQuote || !hasBaseFee || !hasQuoteFee) {
    const elapsed = Date.now() - new Date(paymentState.createdAt).getTime();
    
    if (elapsed > 10 * 60 * 1000) { // 10 minutes timeout
      await this.userOrdersService.updateMarketMakingOrderState(orderId, 'failed');
      return;
    }
    
    // Retry after 10 seconds
    await job.queue.add('check_payment_complete', {
      orderId,
      retryCount: retryCount + 1,
    }, { delay: 10000 });
    return;
  }
  
  // All payments complete
  paymentState.state = 'payment_complete';
  await this.paymentStateRepository.save(paymentState);
  
  // Queue withdrawal
  await job.queue.add('withdraw_to_exchange', {
    orderId,
    marketMakingPairId,
  });
}
```

**Key Points**:
- Polls every 10 seconds
- 10-minute timeout protection
- Verifies sufficient fees
- Auto-retry mechanism

### Stage 5: Withdraw to Exchange
**File**: `src/modules/market-making/user-orders/market-making.processor.ts`

```typescript
@Process('withdraw_to_exchange')
async handleWithdrawToExchange(job: Job) {
  const { orderId, marketMakingPairId } = job.data;
  
  await this.userOrdersService.updateMarketMakingOrderState(orderId, 'withdrawing');
  
  // Step 1: Get exchange API key
  const apiKey = await this.exchangeService.findFirstAPIKeyByExchange(
    pairConfig.exchange_id
  );
  
  // Step 2: Get accurate network identifiers
  const [baseNetwork, quoteNetwork] = await Promise.all([
    this.networkMappingService.getNetworkForAsset(
      paymentState.baseAssetId,
      pairConfig.base_symbol
    ),
    this.networkMappingService.getNetworkForAsset(
      paymentState.quoteAssetId,
      pairConfig.quote_symbol
    ),
  ]);
  
  // Step 3: Get exchange deposit addresses
  const baseDepositResult = await this.exchangeService.getDepositAddress({
    exchange: pairConfig.exchange_id,
    apiKeyId: apiKey.key_id,
    symbol: pairConfig.base_symbol,
    network: baseNetwork,
  });
  
  // Step 4: Execute Mixin withdrawals
  const baseWithdrawalResult = await this.withdrawalService.executeWithdrawal(
    paymentState.baseAssetId,
    baseDepositResult.address,
    baseDepositResult.memo || `MM:${orderId}:base`,
    paymentState.baseAssetAmount
  );
  
  await this.userOrdersService.updateMarketMakingOrderState(
    orderId,
    'withdrawal_confirmed'
  );
  
  // Step 5: Queue withdrawal confirmation monitoring
  await this.withdrawalConfirmationQueue.add('monitor_mm_withdrawal', {
    orderId,
    baseWithdrawalTxId: baseWithdrawalResult[0]?.request_id,
    quoteWithdrawalTxId: quoteWithdrawalResult[0]?.request_id,
  });
}
```

**NetworkMappingService** automatically determines the correct network (BTC, ERC20, TRC20, etc.) based on Mixin's chain_id.

### Stage 6: Withdrawal Confirmation Monitoring
**File**: `src/modules/mixin/withdrawal/withdrawal-confirmation.worker.ts`

```typescript
@Process('monitor_mm_withdrawal')
async handleMonitorMMWithdrawal(job: Job) {
  const { orderId, baseWithdrawalTxId, quoteWithdrawalTxId } = job.data;
  
  // Check Mixin withdrawal status
  const baseTx = await mixinClient.network.fetchTransaction(baseWithdrawalTxId);
  const quoteTx = await mixinClient.network.fetchTransaction(quoteWithdrawalTxId);
  
  // Check exchange deposit status
  // (via exchange API or blockchain explorer)
  
  // When both confirmed, queue campaign join
  if (baseConfirmed && quoteConfirmed) {
    await marketMakingQueue.add('join_campaign', { orderId });
  }
}
```

### Stage 7: Join Campaign
**File**: `src/modules/market-making/user-orders/market-making.processor.ts`

This stage joins **both** campaign systems:
1. **HuFi Campaign** (external Web3 integration) - for blockchain rewards
2. **Local Campaign** (internal tracking) - for analytics and reward distribution

```typescript
@Process('join_campaign')
async handleJoinCampaign(job: Job<{
  orderId: string;
  campaignId?: string;
  hufiCampaign?: { chainId: number; campaignAddress: string };
}>) {
  const { orderId, campaignId, hufiCampaign } = job.data;
  
  await this.userOrdersService.updateMarketMakingOrderState(
    orderId,
    'joining_campaign'
  );
  
  const order = await this.userOrdersService.findMarketMakingByOrderId(orderId);
  
  // Step 1: Try to join HuFi campaign (external Web3)
  if (hufiCampaign?.chainId && hufiCampaign?.campaignAddress) {
    try {
      const campaigns = await this.hufiCampaignService.getCampaigns();
      const matching = campaigns.find(c => 
        c.chainId === hufiCampaign.chainId &&
        c.address.toLowerCase() === hufiCampaign.campaignAddress.toLowerCase()
      );
      if (matching) {
        // Will be auto-joined by CampaignService @Cron job
        this.logger.log(`Found HuFi campaign: ${matching.address}`);
      }
    } catch (err) {
      // Non-blocking - HuFi failure doesn't stop MM flow
      this.logger.error(`HuFi join failed: ${err.message}`);
    }
  }
  
  // Step 2: Store local campaign record for tracking
  const localCampaignId = campaignId || `mm_${order.exchangeName}_${order.pair}`;
  await this.localCampaignService.joinCampaign(
    order.userId,
    localCampaignId,
    orderId
  );
  
  await this.userOrdersService.updateMarketMakingOrderState(
    orderId,
    'campaign_joined'
  );
  
  // Queue market making start
  await job.queue.add('start_mm', {
    userId: order.userId,
    orderId,
  });
}
```

**Key Points**:
- HuFi join is **non-blocking** - failure doesn't stop MM order
- Local record is **always** created for tracking
- Campaign ID defaults to `mm_{exchange}_{pair}` format

### Stage 8: Start Market Making
**File**: `src/modules/market-making/user-orders/market-making.processor.ts`

```typescript
@Process('start_mm')
async handleStartMM(job: Job) {
  const { userId, orderId } = job.data;
  
  const order = await this.userOrdersService.findMarketMakingByOrderId(orderId);
  
  await this.userOrdersService.updateMarketMakingOrderState(orderId, 'running');
  
  // Add first execution cycle
  await job.queue.add('execute_mm_cycle', {
    userId,
    orderId,
    strategyParams: {
      ...order,
      pair: order.pair,
      clientId: orderId,
      bidSpread: Number(order.bidSpread),
      askSpread: Number(order.askSpread),
      orderAmount: Number(order.orderAmount),
      orderRefreshTime: Number(order.orderRefreshTime),
    },
  });
}
```

### Stage 9: Execute Market Making Loop
**File**: `src/modules/market-making/user-orders/market-making.processor.ts`

```typescript
@Process('execute_mm_cycle')
async handleExecuteMMCycle(job: Job) {
  const { userId, orderId, strategyParams } = job.data;
  
  // 1. Check order status
  const order = await this.userOrdersService.findMarketMakingByOrderId(orderId);
  if (order.state !== 'running') {
    return; // Stop loop
  }
  
  // 2. Execute one market making cycle
  await this.strategyService.executeMMCycle(strategyParams);
  
  // 3. Re-queue next cycle
  await job.queue.add('execute_mm_cycle', job.data, {
    delay: strategyParams.orderRefreshTime || 10000,
  });
}
```

**StrategyService.executeMMCycle()** performs:
1. Get current market price
2. Calculate bid/ask prices (based on spreads)
3. Cancel old orders
4. Place new orders
5. Record trading history

## Key Data Structures

### PaymentState
Tracks the 4 required transfers:

```typescript
{
  orderId: string,
  
  // Base Asset
  baseAssetId: string,
  baseAssetAmount: string,
  baseAssetSnapshotId: string,
  
  // Quote Asset
  quoteAssetId: string,
  quoteAssetAmount: string,
  quoteAssetSnapshotId: string,
  
  // Base Fee
  baseFeeAssetId: string,
  baseFeeAssetAmount: string,
  baseFeeAssetSnapshotId: string,
  
  // Quote Fee
  quoteFeeAssetId: string,
  quoteFeeAssetAmount: string,
  quoteFeeAssetSnapshotId: string,
  
  // Required Fees
  requiredBaseWithdrawalFee: string,
  requiredQuoteWithdrawalFee: string,
  requiredMarketMakingFee: string,
  
  state: 'payment_pending' | 'payment_complete' | ...
}
```

### MarketMakingOrder
Stores user strategy configuration:

```typescript
{
  orderId: string,
  userId: string,
  pair: string,              // 'BTC-USDT'
  exchangeName: string,      // 'binance'
  state: MarketMakingStates,
  bidSpread: string,
  askSpread: string,
  orderAmount: string,
  orderRefreshTime: string,
}
```

## Queue Usage

| Queue Name | Job Types | Processor |
|-----------|-----------|-----------|
| `snapshots` | `process_snapshots`<br>`process_snapshot` | SnapshotsProcessor |
| `market-making` | `process_mm_snapshot`<br>`check_payment_complete`<br>`withdraw_to_exchange`<br>`join_campaign`<br>`start_mm`<br>`execute_mm_cycle` | MarketMakingOrderProcessor |
| `withdrawal-confirmations` | `monitor_mm_withdrawal` | WithdrawalConfirmationWorker |

## State Transitions

```
payment_pending
  → payment_incomplete (partial payment)
  → payment_complete (all assets received)
  → withdrawing
  → withdrawal_confirmed
  → deposit_confirming
  → deposit_confirmed
  → joining_campaign
  → campaign_joined
  → created
  → running (market making active)
```

## Error Handling

| Error Scenario | Action |
|---------------|--------|
| Trading pair not found/disabled | Immediate refund |
| Unknown asset | Immediate refund |
| Payment timeout (10 minutes) | Mark failed + refund |
| Insufficient fees | Mark failed + refund |
| Withdrawal failure | Mark failed |
| API key not found | Throw error |

## Example Timeline

```
T=0s      User sends Base Asset (0.1 BTC)
          └─ Mixin snapshot generated

T=2s      SnapshotsProcessor polls snapshot
          └─ Queue: process_snapshot

T=3s      SnapshotsService parses memo
          └─ tradingTypeKey = 1 (Market Making)
          └─ Queue: process_mm_snapshot

T=4s      MarketMakingOrderProcessor handles
          ├─ Validate trading pair ✅
          ├─ Calculate fees ✅
          ├─ Create PaymentState (baseAssetAmount = 0.1)
          └─ Queue: check_payment_complete (delay 5s)

T=30s     User sends Quote Asset (5000 USDT)
          └─ Update PaymentState (quoteAssetAmount = 5000)

T=45s     User sends Base Fee (0.0005 BTC)
          └─ Update PaymentState (baseFeeAssetAmount = 0.0005)

T=60s     User sends Quote Fee (1 USDT)
          └─ Update PaymentState (quoteFeeAssetAmount = 1)

T=70s     check_payment_complete verifies
          ├─ hasBase ✅
          ├─ hasQuote ✅
          ├─ hasBaseFee ✅
          ├─ hasQuoteFee ✅
          └─ Queue: withdraw_to_exchange

T=75s     withdraw_to_exchange executes
          ├─ Get API Key ✅
          ├─ NetworkMappingService: BTC → 'BTC', USDT → 'ERC20'
          ├─ ExchangeService: Get deposit address ✅
          ├─ WithdrawalService: Withdraw 0.1 BTC ✅
          ├─ WithdrawalService: Withdraw 5000 USDT ✅
          └─ Queue: monitor_mm_withdrawal

T=5m      WithdrawalConfirmationWorker confirms
          ├─ Mixin withdrawal confirmed ✅
          ├─ Binance deposit confirmed ✅
          └─ Queue: join_campaign

T=5m5s    join_campaign executes
          ├─ MmCampaignService.joinCampaign() ✅
          └─ Queue: start_mm

T=5m10s   start_mm executes
          ├─ State → 'running'
          └─ Queue: execute_mm_cycle

T=5m10s+  execute_mm_cycle runs continuously
          └─ Repeats every orderRefreshTime
```

## Design Patterns

1. **Queue-Driven State Machine**: Each stage is a Bull Job with state persisted in the database
2. **Idempotency**: Uses `snapshot_id` and `orderId` as job IDs to prevent duplicate processing
3. **Retry Mechanism**: Built-in exponential backoff retry for failures
4. **Timeout Protection**: 10-minute timeout for payment verification
5. **Error Rollback**: Each stage failure triggers refund or failure marking

## Key Files

| File | Responsibility |
|------|---------------|
| `snapshots.processor.ts` | Poll snapshots, distribute processing |
| `snapshots.service.ts` | Parse memo, route to queues |
| `market-making.processor.ts` | Complete market making order lifecycle |
| `network-mapping.service.ts` | Mixin Asset → CCXT Network mapping |
| `exchange.service.ts` | Get exchange deposit addresses |
| `withdrawal.service.ts` | Execute Mixin withdrawals |
| `withdrawal-confirmation.worker.ts` | Monitor withdrawal confirmations |
| `local-campaign.service.ts` | Local campaign management |
| `strategy.service.ts` | Market making strategy execution |

---

**Created**: 2026-01-02  
**Updated**: 2026-01-02
**Version**: 2.0.0  
**Status**: Production Ready
