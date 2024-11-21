import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1732180694516 implements MigrationInterface {
  name = 'NewMigrations1732180694516';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "user_balance" (
                "id" SERIAL NOT NULL,
                "userId" character varying NOT NULL,
                "exchange" character varying NOT NULL,
                "currency" character varying NOT NULL,
                "balance" numeric(15, 8) NOT NULL DEFAULT '0',
                CONSTRAINT "PK_f3edf5a1907e7b430421b9c2ddd" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "mixin_user" (
                "user_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "type" character varying,
                "identity_number" character varying NOT NULL,
                "phone" character varying,
                "full_name" character varying NOT NULL,
                "avatar_url" character varying,
                "jwt_token" character varying NOT NULL,
                "created_at" character varying NOT NULL,
                "last_updated" character varying NOT NULL,
                "walletAddress" character varying,
                CONSTRAINT "PK_2072fe6b1c04d9f4324744dc818" PRIMARY KEY ("user_id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "contribution" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" character varying NOT NULL,
                "clientId" character varying NOT NULL,
                "amount" numeric(18, 8) NOT NULL,
                "status" character varying NOT NULL,
                "transactionHash" character varying NOT NULL,
                "tokenSymbol" character varying NOT NULL,
                "chainId" integer NOT NULL,
                "tokenAddress" character varying NOT NULL,
                "joinedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "strategyId" integer,
                "mixinUserUserId" uuid,
                CONSTRAINT "PK_878330fa5bb34475732a5883d58" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "strategy_instances" (
                "id" SERIAL NOT NULL,
                "strategyKey" character varying NOT NULL,
                "userId" character varying NOT NULL,
                "clientId" character varying NOT NULL,
                "strategyType" character varying NOT NULL,
                "parameters" json NOT NULL,
                "status" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_09080dbac0815101d4b0e883e7a" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "transaction" (
                "id" SERIAL NOT NULL,
                "userId" character varying NOT NULL,
                "exchange" character varying NOT NULL,
                "amount" numeric(10, 2) NOT NULL,
                "currency" character varying NOT NULL,
                "type" character varying NOT NULL,
                "status" character varying NOT NULL DEFAULT 'pending',
                "orderId" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "trade" (
                "id" SERIAL NOT NULL,
                "userId" character varying NOT NULL,
                "clientId" character varying NOT NULL,
                "symbol" character varying NOT NULL,
                "side" character varying NOT NULL,
                "type" character varying NOT NULL,
                "amount" numeric(18, 10) NOT NULL,
                "price" numeric(18, 10) NOT NULL,
                "status" character varying NOT NULL DEFAULT 'pending',
                "orderId" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_d4097908741dc408f8274ebdc53" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "arbitrage_order" (
                "orderId" character varying NOT NULL,
                "userId" character varying NOT NULL,
                "pair" character varying NOT NULL,
                "amountToTrade" character varying NOT NULL,
                "minProfitability" character varying NOT NULL,
                "exchangeAName" character varying NOT NULL,
                "exchangeBName" character varying NOT NULL,
                "balanceA" character varying,
                "balanceB" character varying,
                "state" character varying NOT NULL,
                "createdAt" character varying NOT NULL,
                CONSTRAINT "PK_4e99f9bd26c6f499f24dd30af0d" PRIMARY KEY ("orderId")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "market_making_order" (
                "orderId" character varying NOT NULL,
                "userId" character varying NOT NULL,
                "pair" character varying NOT NULL,
                "exchangeName" character varying NOT NULL,
                "bidSpread" character varying NOT NULL,
                "askSpread" character varying NOT NULL,
                "orderAmount" character varying NOT NULL,
                "orderRefreshTime" character varying NOT NULL,
                "numberOfLayers" character varying NOT NULL,
                "priceSourceType" character varying NOT NULL,
                "amountChangePerLayer" character varying NOT NULL,
                "amountChangeType" character varying NOT NULL,
                "ceilingPrice" character varying NOT NULL,
                "floorPrice" character varying NOT NULL,
                "balanceA" character varying,
                "balanceB" character varying,
                "state" character varying NOT NULL,
                "createdAt" character varying NOT NULL,
                CONSTRAINT "PK_dfe992849c5d888c2a803a5db25" PRIMARY KEY ("orderId")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "payment_state" (
                "orderId" character varying NOT NULL,
                "type" character varying NOT NULL,
                "symbol" character varying NOT NULL,
                "firstAssetId" character varying NOT NULL,
                "firstAssetAmount" character varying NOT NULL,
                "secondAssetId" character varying,
                "secondAssetAmount" character varying,
                "firstSnapshotId" character varying NOT NULL,
                "secondSnapshotId" character varying,
                "state" character varying,
                "createdAt" character varying NOT NULL,
                "updatedAt" character varying NOT NULL,
                CONSTRAINT "PK_5bec61a79e43d6ac6b3fd7ac040" PRIMARY KEY ("orderId")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "spot_order" (
                "orderId" character varying NOT NULL,
                "snapshotId" character varying NOT NULL,
                "userId" character varying NOT NULL,
                "exchangeName" character varying NOT NULL,
                "type" character varying NOT NULL,
                "state" character varying NOT NULL,
                "symbol" character varying NOT NULL,
                "amount" character varying NOT NULL,
                "baseAssetId" character varying NOT NULL,
                "targetAssetId" character varying NOT NULL,
                "apiKeyId" character varying NOT NULL,
                "limitPrice" character varying NOT NULL,
                "createdAt" character varying NOT NULL,
                "updatedAt" character varying NOT NULL,
                CONSTRAINT "PK_52f30b3b642cf04fc684b2db1af" PRIMARY KEY ("orderId")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "performance" (
                "id" SERIAL NOT NULL,
                "userId" character varying NOT NULL,
                "clientId" character varying NOT NULL,
                "strategyType" character varying NOT NULL,
                "profitLoss" double precision NOT NULL,
                "additionalMetrics" text,
                "executedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_bd775d560f1a8d8e0e2e43fc57f" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "rebalance_token" (
                "asset_id" character varying NOT NULL,
                "symbol" character varying NOT NULL,
                CONSTRAINT "PK_bd2ca6805957c97918ad1e574d3" PRIMARY KEY ("asset_id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "rebalance_exchange" (
                "name" character varying NOT NULL,
                CONSTRAINT "PK_33433d2aad84cf4acfb50bc8e3d" PRIMARY KEY ("name")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "rebalance_token_exchange" (
                "token_id" character varying NOT NULL,
                "exchange_id" character varying NOT NULL,
                "minimumBalance" character varying NOT NULL,
                CONSTRAINT "PK_2cd2f896b4a565e1c2a17023c60" PRIMARY KEY ("token_id", "exchange_id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "rebalance_history" (
                "trace_id" character varying NOT NULL,
                "from" character varying NOT NULL,
                "to" character varying NOT NULL,
                "api_key_id" character varying NOT NULL,
                "symbol" character varying NOT NULL,
                "asset_id" character varying NOT NULL,
                "amount" character varying NOT NULL,
                "dest_address" character varying NOT NULL,
                "memo" character varying NOT NULL,
                "fee" character varying NOT NULL,
                "timestamp" character varying NOT NULL,
                CONSTRAINT "PK_3b48d5a5669e7753b2917bfc6b7" PRIMARY KEY ("trace_id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "market_making_history" (
                "id" SERIAL NOT NULL,
                "userId" character varying NOT NULL,
                "clientId" character varying,
                "exchange" character varying NOT NULL,
                "pair" character varying NOT NULL,
                "side" character varying NOT NULL,
                "amount" numeric(10, 2),
                "price" numeric(10, 2),
                "orderId" character varying NOT NULL,
                "executedAt" TIMESTAMP,
                "status" character varying,
                "strategy" character varying,
                CONSTRAINT "PK_e5aad4207764bbf0ba916df4d98" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "snapshot" (
                "snapshot_id" character varying NOT NULL,
                "type" character varying NOT NULL,
                "asset_id" character varying NOT NULL,
                "amount" character varying NOT NULL,
                "user_id" character varying NOT NULL,
                "opponent_id" character varying NOT NULL,
                "memo" character varying NOT NULL,
                "transaction_hash" character varying,
                "created_at" character varying NOT NULL,
                "confirmations" integer,
                "opening_balance" character varying,
                "closing_balance" character varying,
                CONSTRAINT "PK_85e35883678d1dd9a21ea0e22e8" PRIMARY KEY ("snapshot_id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "mixin_message" (
                "message_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "type" character varying NOT NULL,
                "representative_id" character varying NOT NULL,
                "quote_message_id" character varying NOT NULL,
                "conversation_id" character varying NOT NULL,
                "user_id" character varying NOT NULL,
                "session_id" character varying NOT NULL,
                "category" character varying NOT NULL,
                "data" character varying NOT NULL,
                "data_base64" character varying NOT NULL,
                "status" character varying NOT NULL,
                "source" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL,
                "updated_at" TIMESTAMP NOT NULL,
                CONSTRAINT "PK_59511af6cfb2b6bfef074eab2c7" PRIMARY KEY ("message_id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "mixin_release_token" (
                "orderId" character varying NOT NULL,
                "userId" character varying NOT NULL,
                "assetId" character varying NOT NULL,
                "state" character varying NOT NULL,
                "amount" character varying NOT NULL,
                "createdAt" character varying NOT NULL,
                "updatedAt" character varying NOT NULL,
                CONSTRAINT "PK_a5230e1ce2d4e620926d9ea33e2" PRIMARY KEY ("orderId")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "mixin_release_history" (
                "orderId" character varying NOT NULL,
                "snapshotId" character varying NOT NULL,
                "createdAt" character varying NOT NULL,
                "fee" character varying NOT NULL,
                CONSTRAINT "PK_1346a2bf4505550fb70a1c45988" PRIMARY KEY ("orderId")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "growdata_exchanges" (
                "exchange_id" character varying NOT NULL,
                "name" character varying NOT NULL,
                "enable" boolean NOT NULL DEFAULT true,
                CONSTRAINT "PK_04b62ddb093081ed52afa3fa685" PRIMARY KEY ("exchange_id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "growdata_simply_grow_tokens" (
                "asset_id" uuid NOT NULL,
                "name" character varying NOT NULL,
                "symbol" character varying NOT NULL,
                "icon_url" character varying NOT NULL,
                "apy" character varying,
                "enable" boolean NOT NULL DEFAULT true,
                CONSTRAINT "PK_636cc1eb38c728c0758744763d0" PRIMARY KEY ("asset_id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "growdata_arbitrage_pairs" (
                "id" uuid NOT NULL,
                "symbol" character varying NOT NULL,
                "base_symbol" character varying NOT NULL,
                "target_symbol" character varying NOT NULL,
                "base_asset_id" character varying NOT NULL,
                "base_icon_url" character varying NOT NULL,
                "target_asset_id" character varying NOT NULL,
                "target_icon_url" character varying NOT NULL,
                "base_price" character varying,
                "target_price" character varying,
                "base_exchange_id" character varying NOT NULL,
                "target_exchange_id" character varying NOT NULL,
                "enable" boolean NOT NULL DEFAULT true,
                CONSTRAINT "PK_e24c0ee878d2b4a5dc173a48642" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "growdata_market_making_pairs" (
                "id" uuid NOT NULL,
                "symbol" character varying NOT NULL,
                "base_symbol" character varying NOT NULL,
                "target_symbol" character varying NOT NULL,
                "base_asset_id" character varying NOT NULL,
                "base_icon_url" character varying NOT NULL,
                "target_asset_id" character varying NOT NULL,
                "target_icon_url" character varying NOT NULL,
                "base_price" character varying,
                "target_price" character varying,
                "exchange_id" character varying NOT NULL,
                "enable" boolean NOT NULL DEFAULT true,
                CONSTRAINT "PK_cfb9bddcc748cbef49be9476dd6" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "custom_config_entity" (
                "config_id" SERIAL NOT NULL,
                "max_balance_mixin_bot" character varying NOT NULL,
                "max_balance_single_api_key" character varying NOT NULL,
                "funding_account" character varying NOT NULL,
                "spot_fee" character varying NOT NULL,
                CONSTRAINT "PK_7ba5aed5b83b9515ebb4cff37d8" PRIMARY KEY ("config_id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "arbitrage_history" (
                "id" SERIAL NOT NULL,
                "userId" character varying NOT NULL,
                "clientId" character varying,
                "pair" character varying NOT NULL,
                "exchangeAName" character varying,
                "exchangeBName" character varying,
                "amount" numeric(10, 2),
                "buyPrice" numeric(10, 2),
                "sellPrice" numeric(10, 2),
                "profit" integer,
                "executedAt" TIMESTAMP,
                "status" character varying,
                "strategy" character varying,
                CONSTRAINT "PK_407ba393b3734915a80b664781e" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "api_keys_config" (
                "key_id" SERIAL NOT NULL,
                "exchange" character varying NOT NULL,
                "exchange_index" character varying NOT NULL,
                "name" character varying NOT NULL,
                "api_key" character varying NOT NULL,
                "api_secret" character varying NOT NULL,
                CONSTRAINT "PK_de3f6c18a8f6dc9ba664034e6f8" PRIMARY KEY ("key_id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "token_exchange" (
                "token_id" character varying NOT NULL,
                "exchange_id" character varying NOT NULL,
                CONSTRAINT "PK_4b521d6cc7170e30a4766c00560" PRIMARY KEY ("token_id", "exchange_id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_ada04ab269728da74fc963ed7d" ON "token_exchange" ("token_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_dc9eff53eaa8ae892d120b4160" ON "token_exchange" ("exchange_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "contribution"
            ADD CONSTRAINT "FK_5ac95ac829064de9af986f64eb0" FOREIGN KEY ("strategyId") REFERENCES "strategy_instances"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "contribution"
            ADD CONSTRAINT "FK_ea79d9af9fdb9af67e20c66cab0" FOREIGN KEY ("mixinUserUserId") REFERENCES "mixin_user"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "rebalance_token_exchange"
            ADD CONSTRAINT "FK_0c61495dbae208834f3b414bcca" FOREIGN KEY ("token_id") REFERENCES "rebalance_token"("asset_id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "rebalance_token_exchange"
            ADD CONSTRAINT "FK_5952b43988396221ad48ba3d03a" FOREIGN KEY ("exchange_id") REFERENCES "rebalance_exchange"("name") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "token_exchange"
            ADD CONSTRAINT "FK_ada04ab269728da74fc963ed7d9" FOREIGN KEY ("token_id") REFERENCES "rebalance_token"("asset_id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "token_exchange"
            ADD CONSTRAINT "FK_dc9eff53eaa8ae892d120b4160f" FOREIGN KEY ("exchange_id") REFERENCES "rebalance_exchange"("name") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "token_exchange" DROP CONSTRAINT "FK_dc9eff53eaa8ae892d120b4160f"
        `);
    await queryRunner.query(`
            ALTER TABLE "token_exchange" DROP CONSTRAINT "FK_ada04ab269728da74fc963ed7d9"
        `);
    await queryRunner.query(`
            ALTER TABLE "rebalance_token_exchange" DROP CONSTRAINT "FK_5952b43988396221ad48ba3d03a"
        `);
    await queryRunner.query(`
            ALTER TABLE "rebalance_token_exchange" DROP CONSTRAINT "FK_0c61495dbae208834f3b414bcca"
        `);
    await queryRunner.query(`
            ALTER TABLE "contribution" DROP CONSTRAINT "FK_ea79d9af9fdb9af67e20c66cab0"
        `);
    await queryRunner.query(`
            ALTER TABLE "contribution" DROP CONSTRAINT "FK_5ac95ac829064de9af986f64eb0"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_dc9eff53eaa8ae892d120b4160"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_ada04ab269728da74fc963ed7d"
        `);
    await queryRunner.query(`
            DROP TABLE "token_exchange"
        `);
    await queryRunner.query(`
            DROP TABLE "api_keys_config"
        `);
    await queryRunner.query(`
            DROP TABLE "arbitrage_history"
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
            DROP TABLE "mixin_release_history"
        `);
    await queryRunner.query(`
            DROP TABLE "mixin_release_token"
        `);
    await queryRunner.query(`
            DROP TABLE "mixin_message"
        `);
    await queryRunner.query(`
            DROP TABLE "snapshot"
        `);
    await queryRunner.query(`
            DROP TABLE "market_making_history"
        `);
    await queryRunner.query(`
            DROP TABLE "rebalance_history"
        `);
    await queryRunner.query(`
            DROP TABLE "rebalance_token_exchange"
        `);
    await queryRunner.query(`
            DROP TABLE "rebalance_exchange"
        `);
    await queryRunner.query(`
            DROP TABLE "rebalance_token"
        `);
    await queryRunner.query(`
            DROP TABLE "performance"
        `);
    await queryRunner.query(`
            DROP TABLE "spot_order"
        `);
    await queryRunner.query(`
            DROP TABLE "payment_state"
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
            DROP TABLE "strategy_instances"
        `);
    await queryRunner.query(`
            DROP TABLE "contribution"
        `);
    await queryRunner.query(`
            DROP TABLE "mixin_user"
        `);
    await queryRunner.query(`
            DROP TABLE "user_balance"
        `);
  }
}
