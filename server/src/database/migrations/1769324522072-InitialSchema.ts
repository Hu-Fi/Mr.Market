import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1769324522072 implements MigrationInterface {
    name = 'InitialSchema1769324522072'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "withdrawal" (
                "id" varchar PRIMARY KEY NOT NULL,
                "userId" varchar NOT NULL,
                "amount" decimal(20, 8) NOT NULL,
                "assetId" varchar NOT NULL,
                "symbol" varchar NOT NULL,
                "snapshotId" varchar,
                "opponentId" varchar,
                "memo" text,
                "memoVersion" integer,
                "tradingType" varchar,
                "destination" varchar,
                "destinationTag" varchar,
                "mixinTxId" varchar,
                "exchangeTxId" varchar,
                "onChainTxId" varchar,
                "status" varchar NOT NULL DEFAULT ('pending'),
                "type" varchar NOT NULL,
                "errorMessage" text,
                "retryCount" integer NOT NULL DEFAULT (0),
                "lastCheckedAt" datetime,
                "feeAmount" decimal(20, 8),
                "feeAssetId" varchar,
                "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_2a913919534579043ea18dbe26" ON "withdrawal" ("snapshotId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_b7a608334b205a9b7584a7ba30" ON "withdrawal" ("mixinTxId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_4028ed4e39f5c919fc3317882b" ON "withdrawal" ("status")
        `);
        await queryRunner.query(`
            CREATE TABLE "user_balance" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "userId" varchar NOT NULL,
                "exchange" varchar NOT NULL,
                "currency" varchar NOT NULL,
                "balance" text NOT NULL DEFAULT ('0')
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "transaction" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "userId" varchar NOT NULL,
                "exchange" varchar NOT NULL,
                "amount" decimal(10, 2) NOT NULL,
                "currency" varchar NOT NULL,
                "type" varchar NOT NULL,
                "status" varchar NOT NULL DEFAULT ('pending'),
                "orderId" varchar NOT NULL,
                "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "trade" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "userId" varchar NOT NULL,
                "clientId" varchar NOT NULL,
                "symbol" varchar NOT NULL,
                "side" varchar NOT NULL,
                "type" varchar NOT NULL,
                "amount" text NOT NULL,
                "price" text NOT NULL,
                "status" varchar NOT NULL DEFAULT ('pending'),
                "orderId" varchar NOT NULL,
                "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "arbitrage_order" (
                "orderId" varchar PRIMARY KEY NOT NULL,
                "userId" varchar NOT NULL,
                "pair" varchar NOT NULL,
                "amountToTrade" varchar NOT NULL,
                "minProfitability" varchar NOT NULL,
                "exchangeAName" varchar NOT NULL,
                "exchangeBName" varchar NOT NULL,
                "balanceA" varchar,
                "balanceB" varchar,
                "state" varchar NOT NULL,
                "createdAt" varchar NOT NULL,
                "rewardAddress" varchar
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "market_making_order" (
                "orderId" varchar PRIMARY KEY NOT NULL,
                "userId" varchar NOT NULL,
                "pair" varchar NOT NULL,
                "exchangeName" varchar NOT NULL,
                "bidSpread" varchar NOT NULL,
                "askSpread" varchar NOT NULL,
                "orderAmount" varchar NOT NULL,
                "orderRefreshTime" varchar NOT NULL,
                "numberOfLayers" varchar NOT NULL,
                "priceSourceType" varchar NOT NULL,
                "amountChangePerLayer" varchar NOT NULL,
                "amountChangeType" varchar NOT NULL,
                "ceilingPrice" varchar NOT NULL,
                "floorPrice" varchar NOT NULL,
                "balanceA" varchar,
                "balanceB" varchar,
                "state" varchar NOT NULL,
                "createdAt" varchar NOT NULL,
                "rewardAddress" varchar
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "simply_grow_order" (
                "orderId" varchar PRIMARY KEY NOT NULL,
                "userId" varchar NOT NULL,
                "mixinAssetId" varchar NOT NULL,
                "amount" varchar NOT NULL,
                "state" varchar NOT NULL,
                "createdAt" varchar NOT NULL,
                "rewardAddress" varchar NOT NULL
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "payment_state" (
                "orderId" varchar PRIMARY KEY NOT NULL,
                "type" varchar NOT NULL,
                "symbol" varchar NOT NULL,
                "baseAssetId" varchar NOT NULL,
                "baseAssetAmount" varchar NOT NULL DEFAULT ('0'),
                "baseAssetSnapshotId" varchar,
                "quoteAssetId" varchar NOT NULL,
                "quoteAssetAmount" varchar NOT NULL DEFAULT ('0'),
                "quoteAssetSnapshotId" varchar,
                "baseFeeAssetId" varchar,
                "baseFeeAssetAmount" varchar NOT NULL DEFAULT ('0'),
                "baseFeeAssetSnapshotId" varchar,
                "quoteFeeAssetId" varchar,
                "quoteFeeAssetAmount" varchar NOT NULL DEFAULT ('0'),
                "quoteFeeAssetSnapshotId" varchar,
                "requiredBaseWithdrawalFee" varchar,
                "requiredQuoteWithdrawalFee" varchar,
                "requiredMarketMakingFee" varchar,
                "state" varchar,
                "createdAt" varchar NOT NULL,
                "updatedAt" varchar NOT NULL
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "mixin_user" (
                "user_id" varchar PRIMARY KEY NOT NULL,
                "type" varchar,
                "identity_number" varchar NOT NULL,
                "phone" varchar,
                "full_name" varchar NOT NULL,
                "avatar_url" varchar,
                "jwt_token" varchar NOT NULL,
                "created_at" varchar NOT NULL,
                "last_updated" varchar NOT NULL,
                "walletAddress" varchar
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "contribution" (
                "id" varchar PRIMARY KEY NOT NULL,
                "userId" varchar NOT NULL,
                "clientId" varchar NOT NULL,
                "amount" decimal(18, 8) NOT NULL,
                "status" varchar NOT NULL,
                "transactionHash" varchar NOT NULL,
                "tokenSymbol" varchar NOT NULL,
                "chainId" integer NOT NULL,
                "tokenAddress" varchar NOT NULL,
                "joinedAt" datetime NOT NULL DEFAULT (datetime('now')),
                "strategyId" integer,
                "mixinUserUserId" varchar
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "strategy_instances" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "strategyKey" varchar NOT NULL,
                "userId" varchar NOT NULL,
                "clientId" varchar NOT NULL,
                "strategyType" varchar NOT NULL,
                "startPrice" integer NOT NULL,
                "parameters" json NOT NULL,
                "status" varchar NOT NULL,
                "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "spot_order" (
                "orderId" varchar PRIMARY KEY NOT NULL,
                "snapshotId" varchar NOT NULL,
                "userId" varchar NOT NULL,
                "exchangeName" varchar NOT NULL,
                "type" varchar NOT NULL,
                "state" varchar NOT NULL,
                "symbol" varchar NOT NULL,
                "amount" varchar NOT NULL,
                "baseAssetId" varchar NOT NULL,
                "targetAssetId" varchar NOT NULL,
                "apiKeyId" varchar NOT NULL,
                "limitPrice" varchar NOT NULL,
                "createdAt" varchar NOT NULL,
                "updatedAt" varchar NOT NULL
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "spotdata_trading_pairs" (
                "id" varchar PRIMARY KEY NOT NULL,
                "ccxt_id" varchar NOT NULL,
                "symbol" varchar NOT NULL,
                "exchange_id" varchar NOT NULL,
                "amount_significant_figures" varchar NOT NULL,
                "price_significant_figures" varchar NOT NULL,
                "buy_decimal_digits" varchar NOT NULL,
                "sell_decimal_digits" varchar NOT NULL,
                "max_buy_amount" varchar NOT NULL,
                "max_sell_amount" varchar NOT NULL,
                "base_asset_id" varchar NOT NULL,
                "quote_asset_id" varchar NOT NULL,
                "custom_fee_rate" varchar,
                "enable" boolean NOT NULL
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "performance" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "userId" varchar NOT NULL,
                "clientId" varchar NOT NULL,
                "strategyType" varchar NOT NULL,
                "profitLoss" float NOT NULL,
                "additionalMetrics" text,
                "executedAt" datetime NOT NULL DEFAULT (datetime('now'))
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "mixin_release_token" (
                "orderId" varchar PRIMARY KEY NOT NULL,
                "userId" varchar NOT NULL,
                "assetId" varchar NOT NULL,
                "state" varchar NOT NULL,
                "amount" varchar NOT NULL,
                "createdAt" varchar NOT NULL,
                "updatedAt" varchar NOT NULL
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "mixin_release_history" (
                "orderId" varchar PRIMARY KEY NOT NULL,
                "snapshotId" varchar NOT NULL,
                "createdAt" varchar NOT NULL,
                "fee" varchar NOT NULL
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "mixin_message" (
                "message_id" varchar PRIMARY KEY NOT NULL,
                "type" varchar NOT NULL,
                "representative_id" varchar NOT NULL,
                "quote_message_id" varchar NOT NULL,
                "conversation_id" varchar NOT NULL,
                "user_id" varchar NOT NULL,
                "session_id" varchar NOT NULL,
                "category" varchar NOT NULL,
                "data" varchar NOT NULL,
                "data_base64" varchar NOT NULL,
                "status" varchar NOT NULL,
                "source" varchar NOT NULL,
                "created_at" text NOT NULL,
                "updated_at" text NOT NULL
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "market_making_history" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "userId" varchar NOT NULL,
                "clientId" varchar,
                "exchange" varchar NOT NULL,
                "pair" varchar NOT NULL,
                "side" varchar NOT NULL,
                "amount" text,
                "price" text,
                "orderId" varchar NOT NULL,
                "executedAt" datetime,
                "status" varchar,
                "strategy" varchar,
                "strategyInstanceId" varchar
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "growdata_exchanges" (
                "exchange_id" varchar PRIMARY KEY NOT NULL,
                "name" varchar NOT NULL,
                "icon_url" varchar,
                "enable" boolean NOT NULL DEFAULT (1)
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "growdata_simply_grow_tokens" (
                "asset_id" varchar PRIMARY KEY NOT NULL,
                "name" varchar NOT NULL,
                "symbol" varchar NOT NULL,
                "icon_url" varchar NOT NULL,
                "apy" varchar,
                "enable" boolean NOT NULL DEFAULT (1)
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "growdata_arbitrage_pairs" (
                "id" varchar PRIMARY KEY NOT NULL,
                "symbol" varchar NOT NULL,
                "base_symbol" varchar NOT NULL,
                "quote_symbol" varchar NOT NULL,
                "base_asset_id" varchar NOT NULL,
                "base_icon_url" varchar NOT NULL,
                "quote_asset_id" varchar NOT NULL,
                "quote_icon_url" varchar NOT NULL,
                "base_price" varchar,
                "target_price" varchar,
                "base_exchange_id" varchar NOT NULL,
                "target_exchange_id" varchar NOT NULL,
                "enable" boolean NOT NULL DEFAULT (1)
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "growdata_market_making_pairs" (
                "id" varchar PRIMARY KEY NOT NULL,
                "symbol" varchar NOT NULL,
                "base_symbol" varchar NOT NULL,
                "quote_symbol" varchar NOT NULL,
                "base_asset_id" varchar NOT NULL,
                "base_icon_url" varchar NOT NULL,
                "quote_asset_id" varchar NOT NULL,
                "quote_icon_url" varchar NOT NULL,
                "base_price" varchar,
                "target_price" varchar,
                "exchange_id" varchar NOT NULL,
                "custom_fee_rate" varchar,
                "enable" boolean NOT NULL DEFAULT (1)
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "custom_config_entity" (
                "config_id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "max_balance_mixin_bot" varchar NOT NULL,
                "max_balance_single_api_key" varchar NOT NULL,
                "funding_account" varchar NOT NULL,
                "spot_fee" varchar NOT NULL,
                "market_making_fee" varchar NOT NULL DEFAULT ('0.001'),
                "enable_spot_fee" boolean NOT NULL DEFAULT (1),
                "enable_market_making_fee" boolean NOT NULL DEFAULT (1)
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "campaign" (
                "id" varchar PRIMARY KEY NOT NULL,
                "name" varchar NOT NULL,
                "pair" varchar NOT NULL,
                "exchange" varchar NOT NULL,
                "rewardToken" varchar NOT NULL,
                "startTime" datetime NOT NULL,
                "endTime" datetime NOT NULL,
                "status" varchar NOT NULL,
                "totalReward" decimal(20, 8) NOT NULL,
                "type" varchar,
                "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "campaign_participation" (
                "id" varchar PRIMARY KEY NOT NULL,
                "campaignId" varchar NOT NULL,
                "userId" varchar NOT NULL,
                "orderId" varchar,
                "contributionAmount" decimal(20, 8) NOT NULL DEFAULT (0),
                "rewardAmount" decimal(20, 8),
                "status" varchar NOT NULL,
                "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "arbitrage_history" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "userId" varchar NOT NULL,
                "clientId" varchar,
                "pair" varchar NOT NULL,
                "exchangeAName" varchar,
                "exchangeBName" varchar,
                "amount" text,
                "buyPrice" text,
                "sellPrice" text,
                "profit" integer,
                "executedAt" datetime,
                "status" varchar,
                "strategy" varchar
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "api_keys_config" (
                "key_id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "exchange" varchar NOT NULL,
                "exchange_index" varchar NOT NULL,
                "name" varchar NOT NULL,
                "api_key" varchar NOT NULL,
                "api_secret" varchar NOT NULL
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "admin_market_making_config" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "exchange" varchar NOT NULL,
                "symbol" varchar NOT NULL,
                "baseSymbol" varchar NOT NULL,
                "quoteSymbol" varchar NOT NULL,
                "baseAssetId" varchar NOT NULL,
                "quoteAssetId" varchar NOT NULL,
                "baseIcon" varchar,
                "quoteIcon" varchar,
                "isEnabled" boolean NOT NULL DEFAULT (1)
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_contribution" (
                "id" varchar PRIMARY KEY NOT NULL,
                "userId" varchar NOT NULL,
                "clientId" varchar NOT NULL,
                "amount" decimal(18, 8) NOT NULL,
                "status" varchar NOT NULL,
                "transactionHash" varchar NOT NULL,
                "tokenSymbol" varchar NOT NULL,
                "chainId" integer NOT NULL,
                "tokenAddress" varchar NOT NULL,
                "joinedAt" datetime NOT NULL DEFAULT (datetime('now')),
                "strategyId" integer,
                "mixinUserUserId" varchar,
                CONSTRAINT "FK_5ac95ac829064de9af986f64eb0" FOREIGN KEY ("strategyId") REFERENCES "strategy_instances" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
                CONSTRAINT "FK_ea79d9af9fdb9af67e20c66cab0" FOREIGN KEY ("mixinUserUserId") REFERENCES "mixin_user" ("user_id") ON DELETE CASCADE ON UPDATE NO ACTION
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_contribution"(
                    "id",
                    "userId",
                    "clientId",
                    "amount",
                    "status",
                    "transactionHash",
                    "tokenSymbol",
                    "chainId",
                    "tokenAddress",
                    "joinedAt",
                    "strategyId",
                    "mixinUserUserId"
                )
            SELECT "id",
                "userId",
                "clientId",
                "amount",
                "status",
                "transactionHash",
                "tokenSymbol",
                "chainId",
                "tokenAddress",
                "joinedAt",
                "strategyId",
                "mixinUserUserId"
            FROM "contribution"
        `);
        await queryRunner.query(`
            DROP TABLE "contribution"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_contribution"
                RENAME TO "contribution"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "contribution"
                RENAME TO "temporary_contribution"
        `);
        await queryRunner.query(`
            CREATE TABLE "contribution" (
                "id" varchar PRIMARY KEY NOT NULL,
                "userId" varchar NOT NULL,
                "clientId" varchar NOT NULL,
                "amount" decimal(18, 8) NOT NULL,
                "status" varchar NOT NULL,
                "transactionHash" varchar NOT NULL,
                "tokenSymbol" varchar NOT NULL,
                "chainId" integer NOT NULL,
                "tokenAddress" varchar NOT NULL,
                "joinedAt" datetime NOT NULL DEFAULT (datetime('now')),
                "strategyId" integer,
                "mixinUserUserId" varchar
            )
        `);
        await queryRunner.query(`
            INSERT INTO "contribution"(
                    "id",
                    "userId",
                    "clientId",
                    "amount",
                    "status",
                    "transactionHash",
                    "tokenSymbol",
                    "chainId",
                    "tokenAddress",
                    "joinedAt",
                    "strategyId",
                    "mixinUserUserId"
                )
            SELECT "id",
                "userId",
                "clientId",
                "amount",
                "status",
                "transactionHash",
                "tokenSymbol",
                "chainId",
                "tokenAddress",
                "joinedAt",
                "strategyId",
                "mixinUserUserId"
            FROM "temporary_contribution"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_contribution"
        `);
        await queryRunner.query(`
            DROP TABLE "admin_market_making_config"
        `);
        await queryRunner.query(`
            DROP TABLE "api_keys_config"
        `);
        await queryRunner.query(`
            DROP TABLE "arbitrage_history"
        `);
        await queryRunner.query(`
            DROP TABLE "campaign_participation"
        `);
        await queryRunner.query(`
            DROP TABLE "campaign"
        `);
        await queryRunner.query(`
            DROP TABLE "custom_config_entity"
        `);
        await queryRunner.query(`
            DROP TABLE "growdata_market_making_pairs"
        `);
        await queryRunner.query(`
            DROP TABLE "growdata_arbitrage_pairs"
        `);
        await queryRunner.query(`
            DROP TABLE "growdata_simply_grow_tokens"
        `);
        await queryRunner.query(`
            DROP TABLE "growdata_exchanges"
        `);
        await queryRunner.query(`
            DROP TABLE "market_making_history"
        `);
        await queryRunner.query(`
            DROP TABLE "mixin_message"
        `);
        await queryRunner.query(`
            DROP TABLE "mixin_release_history"
        `);
        await queryRunner.query(`
            DROP TABLE "mixin_release_token"
        `);
        await queryRunner.query(`
            DROP TABLE "performance"
        `);
        await queryRunner.query(`
            DROP TABLE "spotdata_trading_pairs"
        `);
        await queryRunner.query(`
            DROP TABLE "spot_order"
        `);
        await queryRunner.query(`
            DROP TABLE "strategy_instances"
        `);
        await queryRunner.query(`
            DROP TABLE "contribution"
        `);
        await queryRunner.query(`
            DROP TABLE "mixin_user"
        `);
        await queryRunner.query(`
            DROP TABLE "payment_state"
        `);
        await queryRunner.query(`
            DROP TABLE "simply_grow_order"
        `);
        await queryRunner.query(`
            DROP TABLE "market_making_order"
        `);
        await queryRunner.query(`
            DROP TABLE "arbitrage_order"
        `);
        await queryRunner.query(`
            DROP TABLE "trade"
        `);
        await queryRunner.query(`
            DROP TABLE "transaction"
        `);
        await queryRunner.query(`
            DROP TABLE "user_balance"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_4028ed4e39f5c919fc3317882b"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_b7a608334b205a9b7584a7ba30"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_2a913919534579043ea18dbe26"
        `);
        await queryRunner.query(`
            DROP TABLE "withdrawal"
        `);
    }

}
