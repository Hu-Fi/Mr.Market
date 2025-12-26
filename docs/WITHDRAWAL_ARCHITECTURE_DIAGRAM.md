# Withdrawal System Architecture Diagram

## System Component Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         MIXIN BOT WITHDRAWAL SYSTEM                      │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│              │         │              │         │              │
│   USER       │────────▶│  MIXIN BOT   │────────▶│  DATABASE    │
│              │  Sends  │              │  Stores │              │
└──────────────┘  Funds  └──────────────┘  State  └──────────────┘
      │                         │                         │
      │                         │                         │
      ▼                         ▼                         ▼
 Withdrawal                Snapshot                 Withdrawal
   Memo                    Detection                  Record
```

## Detailed Flow Diagram

```
┌───────────────────────────────────────────────────────────────────────────┐
│  PHASE 1: SNAPSHOT DETECTION & MEMO VALIDATION                            │
└───────────────────────────────────────────────────────────────────────────┘

User sends funds with memo
        │
        ▼
┌─────────────────────┐
│  Mixin Network      │
│  (Blockchain)       │
└──────────┬──────────┘
           │ New snapshot event
           ▼
┌─────────────────────────────────────┐
│  SnapshotsProcessor                 │
│  • Polls every 5 seconds            │
│  • Fetches new snapshots            │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  SnapshotsService.handleSnapshot()  │
│  • Decode hex memo                  │
│  • Base58 decode                    │
│  • Verify checksum ✓                │
│  • Check version = 1 ✓             │
└──────────┬──────────────────────────┘
           │
           ├─── Invalid? ──▶ REFUND
           │
           ▼ Valid
┌─────────────────────────────────────┐
│  Switch on tradingTypeKey           │
│  • 0: Spot                          │
│  • 1: Market Making                 │
│  • 2: Simply Grow                   │
│  • 3: Withdrawal ◀── WE ARE HERE    │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  decodeWithdrawalMemo()             │
│  • Extract destination address      │
│  • Extract optional tag             │
└──────────┬──────────────────────────┘
           │
           ▼
     Emit Event
 'withdrawal.create'


┌───────────────────────────────────────────────────────────────────────────┐
│  PHASE 2: INITIALIZATION & QUEUEING                                       │
└───────────────────────────────────────────────────────────────────────────┘

           │
           ▼
┌─────────────────────────────────────┐
│  WithdrawalEventHandler             │
│  Listening to 'withdrawal.create'   │
└──────────┬──────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────┐
│  WithdrawalService.initializeWithdrawal()        │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │ CHECK: Withdrawal exists for snapshot ID? │ │
│  └────────────┬───────────────────────────────┘ │
│               │                                  │
│               ├─── YES ──▶ Skip (already done)   │
│               │                                  │
│               ▼ NO                               │
│  ┌────────────────────────────────────────────┐ │
│  │ Create Withdrawal Record                  │ │
│  │ • snapshotId                              │ │
│  │ • destination                             │ │
│  │ • amount                                  │ │
│  │ • status = 'pending'                      │ │
│  └────────────┬───────────────────────────────┘ │
└───────────────┼──────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│  Save to Database                   │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  Queue to Bull                      │
│  • Queue: 'withdrawals'             │
│  • Job: 'process_withdrawal'        │
│  • JobID: withdrawal.id             │
│  • Attempts: 3                      │
│  • Backoff: exponential 5s          │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  Update status = 'queued'           │
└─────────────────────────────────────┘


┌───────────────────────────────────────────────────────────────────────────┐
│  PHASE 3: WITHDRAWAL PROCESSING (MULTI-LAYER PROTECTION)                  │
└───────────────────────────────────────────────────────────────────────────┘

           │
           ▼
┌─────────────────────────────────────────┐
│  WithdrawalProcessor                    │
│  (Process 'process_withdrawal' jobs)    │
└──────────┬──────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────┐
│  LAYER 1: In-Memory Check                                │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Is withdrawal.id in processingSet?                 │  │
│  └────────┬───────────────────────────────────────────┘  │
│           ├─── YES ──▶ EXIT (already processing)         │
│           ▼ NO                                           │
│  Add to processingSet                                    │
└──────────┬───────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────┐
│  LAYER 2: Fetch from Database                            │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Get withdrawal by ID                               │  │
│  └────────┬───────────────────────────────────────────┘  │
│           │                                              │
│           ├─── NOT FOUND ──▶ EXIT                        │
│           │                                              │
│  ┌────────▼───────────────────────────────────────────┐  │
│  │ Check status                                       │  │
│  │ Is status in [completed, refunded, sent,           │  │
│  │                processing]?                        │  │
│  └────────┬───────────────────────────────────────────┘  │
│           ├─── YES ──▶ EXIT (already done)               │
│           ▼ NO                                           │
└──────────┬───────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────┐
│  LAYER 3: Atomic Database Update                         │
│  ┌────────────────────────────────────────────────────┐  │
│  │ UPDATE withdrawal                                  │  │
│  │ SET status = 'processing'                          │  │
│  │ WHERE id = ? AND status IN ('pending', 'queued')  │  │
│  └────────┬───────────────────────────────────────────┘  │
│           │                                              │
│  ┌────────▼───────────────────────────────────────────┐  │
│  │ Check affected rows                                │  │
│  └────────┬───────────────────────────────────────────┘  │
│           ├─── 0 rows ──▶ EXIT (race condition)          │
│           ▼ 1 row updated                                │
│  NOW WE OWN THIS WITHDRAWAL ✓                            │
└──────────┬───────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  Check Balance                      │
│  Is balance >= amount?              │
└──────────┬──────────────────────────┘
           │
           ├─── NO ──▶ Mark Failed
           │           "Insufficient balance"
           ▼ YES
┌─────────────────────────────────────┐
│  Execute Withdrawal                 │
│  SnapshotsService.withdrawal()      │
│  • Build transaction                │
│  • Sign transaction                 │
│  • Send to Mixin                    │
└──────────┬──────────────────────────┘
           │
           ├─── ERROR ──▶ Increment retry
           │              ├─── retries < 3 ──▶ Requeue
           │              └─── retries >= 3 ──▶ Mark Failed
           ▼ SUCCESS
┌─────────────────────────────────────┐
│  Update Withdrawal                  │
│  • status = 'sent'                  │
│  • mixinTxId = result.request_id    │
└──────────┬──────────────────────────┘
           │
           ▼
    Remove from processingSet


┌───────────────────────────────────────────────────────────────────────────┐
│  PHASE 4: CONFIRMATION MONITORING (Continuous Loop)                       │
└───────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  WithdrawalConfirmationWorker           │
│  Runs every 30 seconds                  │
└──────────┬──────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│  Get Pending Withdrawals                │
│  WHERE status IN ('processing',         │
│                    'sent',               │
│                    'confirmed')          │
└──────────┬──────────────────────────────┘
           │
           ▼
    For each withdrawal
           │
           ▼
┌─────────────────────────────────────────┐
│  Query Mixin API                        │
│  fetchSafeSnapshots()                   │
│  Find transaction by mixinTxId          │
└──────────┬──────────────────────────────┘
           │
           ├─── Not Found ──▶ Continue (wait)
           │
           ▼ Found
┌─────────────────────────────────────────┐
│  Check Transaction Status               │
└──────────┬──────────────────────────────┘
           │
           ├─── Completed ──▶┌──────────────────────┐
           │                 │ status = 'completed' │
           │                 │ onChainTxId = hash   │
           │                 └──────────────────────┘
           │
           ├─── Pending ────▶┌──────────────────────┐
           │                 │ status = 'confirmed' │
           │                 │ onChainTxId = hash   │
           │                 └──────────────────────┘
           │
           └─── Failed ─────▶┌──────────────────────┐
                             │ status = 'failed'    │
                             │ errorMessage = ...   │
                             └──────────────────────┘
           │
           ▼
    Update lastCheckedAt
           │
           ▼
    Wait 30 seconds ──▶ Loop back


┌───────────────────────────────────────────────────────────────────────────┐
│  STATUS PROGRESSION                                                        │
└───────────────────────────────────────────────────────────────────────────┘

pending ──▶ queued ──▶ processing ──▶ sent ──▶ confirmed ──▶ completed ✓
              │           │            │
              │           │            └──▶ failed ✗
              │           │
              │           └──▶ failed ✗ (max retries)
              │
              └──▶ (automatic via queue)


┌───────────────────────────────────────────────────────────────────────────┐
│  ERROR HANDLING PATHS                                                      │
└───────────────────────────────────────────────────────────────────────────┘

Invalid Memo
    │
    └──▶ SnapshotsService.refund()
          ├─── Build refund transaction
          └─── Send back to opponent_id

Insufficient Balance
    │
    └──▶ WithdrawalService.markAsFailed()
          └─── status = 'failed'
               errorMessage = 'Insufficient balance'

Processing Error (retry < 3)
    │
    └──▶ Increment retryCount
          └─── Re-queue to Bull
                └─── Exponential backoff (5s, 10s, 20s)

Processing Error (retry >= 3)
    │
    └──▶ WithdrawalService.markAsFailed()
          └─── status = 'failed'
               errorMessage = <error details>


┌───────────────────────────────────────────────────────────────────────────┐
│  TECHNOLOGY STACK                                                          │
└───────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
│   NestJS         │   │   TypeORM        │   │   Bull Queue     │
│   Framework      │◀─▶│   ORM            │◀─▶│   Job Queue      │
└──────────────────┘   └──────────────────┘   └──────────────────┘
        │                      │                        │
        │                      │                        │
        ▼                      ▼                        ▼
┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
│   EventEmitter   │   │   PostgreSQL     │   │   Redis          │
│   Events         │   │   Database       │   │   Queue Storage  │
└──────────────────┘   └──────────────────┘   └──────────────────┘


┌───────────────────────────────────────────────────────────────────────────┐
│  DATA FLOW                                                                 │
└───────────────────────────────────────────────────────────────────────────┘

Snapshot ──▶ Memo Decode ──▶ Event ──▶ DB Record ──▶ Queue ──▶ Process
    │            │              │           │           │          │
    │            │              │           │           │          │
    ▼            ▼              ▼           ▼           ▼          ▼
snapshot_id  destination   withdrawal  withdrawal   Bull Job   Mixin TX
opponent_id      tag         .create    table id     Queue      Network
amount        assetId       event       status=      Redis      Blockchain
memo          version                   pending


┌───────────────────────────────────────────────────────────────────────────┐
│  SECURITY LAYERS                                                           │
└───────────────────────────────────────────────────────────────────────────┘

Layer 1: Memo Checksum    ──▶ Prevents corrupted/invalid data
Layer 2: Snapshot ID      ──▶ Prevents duplicate initialization
Layer 3: In-Memory Set    ──▶ Prevents concurrent processing
Layer 4: Database Status  ──▶ Prevents re-processing completed
Layer 5: Atomic Update    ──▶ Prevents race conditions
Layer 6: Balance Check    ──▶ Prevents overdraft
```

## Summary

This withdrawal system implements a **robust, multi-layered architecture** that ensures:

✅ **Reliability**: Automatic retries, error handling, status tracking  
✅ **Security**: Multiple prevention layers against double withdrawals  
✅ **Visibility**: Complete audit trail in database  
✅ **Scalability**: Queue-based processing, can add more workers  
✅ **Monitoring**: Continuous confirmation checking  

**Key Innovation**: The **4-layer double-withdrawal prevention** system ensures that even if multiple workers or processes try to handle the same withdrawal, only one will succeed in processing it.
