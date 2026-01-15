import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWithdrawalFields1735226400000 implements MigrationInterface {
  name = 'AddWithdrawalFields1735226400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add new columns to withdrawal table
    await queryRunner.query(`
      ALTER TABLE "withdrawal" 
      ADD COLUMN "snapshotId" varchar,
      ADD COLUMN "opponentId" varchar,
      ADD COLUMN "memo" text,
      ADD COLUMN "memoVersion" integer,
      ADD COLUMN "tradingType" varchar,
      ADD COLUMN "destination" varchar,
      ADD COLUMN "destinationTag" varchar,
      ADD COLUMN "errorMessage" text,
      ADD COLUMN "retryCount" integer DEFAULT 0,
      ADD COLUMN "lastCheckedAt" timestamp,
      ADD COLUMN "feeAmount" decimal(20,8),
      ADD COLUMN "feeAssetId" varchar
    `);

    // Update status column to have default value
    await queryRunner.query(`
      ALTER TABLE "withdrawal" 
      ALTER COLUMN "status" SET DEFAULT 'pending'
    `);

    // Create indexes for performance
    await queryRunner.query(`
      CREATE INDEX "IDX_withdrawal_snapshotId" ON "withdrawal" ("snapshotId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_withdrawal_mixinTxId" ON "withdrawal" ("mixinTxId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_withdrawal_status" ON "withdrawal" ("status")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX "IDX_withdrawal_status"`);
    await queryRunner.query(`DROP INDEX "IDX_withdrawal_mixinTxId"`);
    await queryRunner.query(`DROP INDEX "IDX_withdrawal_snapshotId"`);

    // Remove default from status column
    await queryRunner.query(`
      ALTER TABLE "withdrawal" 
      ALTER COLUMN "status" DROP DEFAULT
    `);

    // Drop new columns
    await queryRunner.query(`
      ALTER TABLE "withdrawal" 
      DROP COLUMN "feeAssetId",
      DROP COLUMN "feeAmount",
      DROP COLUMN "lastCheckedAt",
      DROP COLUMN "retryCount",
      DROP COLUMN "errorMessage",
      DROP COLUMN "destinationTag",
      DROP COLUMN "destination",
      DROP COLUMN "tradingType",
      DROP COLUMN "memoVersion",
      DROP COLUMN "memo",
      DROP COLUMN "opponentId",
      DROP COLUMN "snapshotId"
    `);
  }
}
