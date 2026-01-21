import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixPaymentStateColumns1735400000000 implements MigrationInterface {
  name = 'FixPaymentStateColumns1735400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'payment_state'
            AND column_name = 'firstAssetId'
        ) AND NOT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'payment_state'
            AND column_name = 'baseAssetId'
        ) THEN
          ALTER TABLE "payment_state" RENAME COLUMN "firstAssetId" TO "baseAssetId";
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'payment_state'
            AND column_name = 'firstAssetAmount'
        ) AND NOT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'payment_state'
            AND column_name = 'baseAssetAmount'
        ) THEN
          ALTER TABLE "payment_state" RENAME COLUMN "firstAssetAmount" TO "baseAssetAmount";
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'payment_state'
            AND column_name = 'firstSnapshotId'
        ) AND NOT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'payment_state'
            AND column_name = 'baseAssetSnapshotId'
        ) THEN
          ALTER TABLE "payment_state" RENAME COLUMN "firstSnapshotId" TO "baseAssetSnapshotId";
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'payment_state'
            AND column_name = 'secondAssetId'
        ) AND NOT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'payment_state'
            AND column_name = 'quoteAssetId'
        ) THEN
          ALTER TABLE "payment_state" RENAME COLUMN "secondAssetId" TO "quoteAssetId";
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'payment_state'
            AND column_name = 'secondAssetAmount'
        ) AND NOT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'payment_state'
            AND column_name = 'quoteAssetAmount'
        ) THEN
          ALTER TABLE "payment_state" RENAME COLUMN "secondAssetAmount" TO "quoteAssetAmount";
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'payment_state'
            AND column_name = 'secondSnapshotId'
        ) AND NOT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'payment_state'
            AND column_name = 'quoteAssetSnapshotId'
        ) THEN
          ALTER TABLE "payment_state" RENAME COLUMN "secondSnapshotId" TO "quoteAssetSnapshotId";
        END IF;
      END $$;
    `);

    await queryRunner.query(
      `ALTER TABLE "payment_state" ADD COLUMN IF NOT EXISTS "baseFeeAssetId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_state" ADD COLUMN IF NOT EXISTS "baseFeeAssetAmount" character varying NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_state" ADD COLUMN IF NOT EXISTS "baseFeeAssetSnapshotId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_state" ADD COLUMN IF NOT EXISTS "quoteFeeAssetId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_state" ADD COLUMN IF NOT EXISTS "quoteFeeAssetAmount" character varying NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_state" ADD COLUMN IF NOT EXISTS "quoteFeeAssetSnapshotId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_state" ADD COLUMN IF NOT EXISTS "requiredBaseWithdrawalFee" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_state" ADD COLUMN IF NOT EXISTS "requiredQuoteWithdrawalFee" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_state" ADD COLUMN IF NOT EXISTS "requiredMarketMakingFee" character varying`,
    );

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'payment_state'
            AND column_name = 'baseAssetAmount'
        ) THEN
          ALTER TABLE "payment_state" ALTER COLUMN "baseAssetAmount" SET DEFAULT '0';
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'payment_state'
            AND column_name = 'quoteAssetAmount'
        ) THEN
          ALTER TABLE "payment_state" ALTER COLUMN "quoteAssetAmount" SET DEFAULT '0';
        END IF;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payment_state" DROP COLUMN IF EXISTS "requiredMarketMakingFee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_state" DROP COLUMN IF EXISTS "requiredQuoteWithdrawalFee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_state" DROP COLUMN IF EXISTS "requiredBaseWithdrawalFee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_state" DROP COLUMN IF EXISTS "quoteFeeAssetSnapshotId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_state" DROP COLUMN IF EXISTS "quoteFeeAssetAmount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_state" DROP COLUMN IF EXISTS "quoteFeeAssetId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_state" DROP COLUMN IF EXISTS "baseFeeAssetSnapshotId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_state" DROP COLUMN IF EXISTS "baseFeeAssetAmount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_state" DROP COLUMN IF EXISTS "baseFeeAssetId"`,
    );

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'payment_state'
            AND column_name = 'baseAssetAmount'
        ) THEN
          ALTER TABLE "payment_state" ALTER COLUMN "baseAssetAmount" DROP DEFAULT;
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'payment_state'
            AND column_name = 'quoteAssetAmount'
        ) THEN
          ALTER TABLE "payment_state" ALTER COLUMN "quoteAssetAmount" DROP DEFAULT;
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'payment_state'
            AND column_name = 'quoteAssetSnapshotId'
        ) AND NOT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'payment_state'
            AND column_name = 'secondSnapshotId'
        ) THEN
          ALTER TABLE "payment_state" RENAME COLUMN "quoteAssetSnapshotId" TO "secondSnapshotId";
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'payment_state'
            AND column_name = 'quoteAssetAmount'
        ) AND NOT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'payment_state'
            AND column_name = 'secondAssetAmount'
        ) THEN
          ALTER TABLE "payment_state" RENAME COLUMN "quoteAssetAmount" TO "secondAssetAmount";
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'payment_state'
            AND column_name = 'quoteAssetId'
        ) AND NOT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'payment_state'
            AND column_name = 'secondAssetId'
        ) THEN
          ALTER TABLE "payment_state" RENAME COLUMN "quoteAssetId" TO "secondAssetId";
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'payment_state'
            AND column_name = 'baseAssetSnapshotId'
        ) AND NOT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'payment_state'
            AND column_name = 'firstSnapshotId'
        ) THEN
          ALTER TABLE "payment_state" RENAME COLUMN "baseAssetSnapshotId" TO "firstSnapshotId";
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'payment_state'
            AND column_name = 'baseAssetAmount'
        ) AND NOT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'payment_state'
            AND column_name = 'firstAssetAmount'
        ) THEN
          ALTER TABLE "payment_state" RENAME COLUMN "baseAssetAmount" TO "firstAssetAmount";
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'payment_state'
            AND column_name = 'baseAssetId'
        ) AND NOT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'payment_state'
            AND column_name = 'firstAssetId'
        ) THEN
          ALTER TABLE "payment_state" RENAME COLUMN "baseAssetId" TO "firstAssetId";
        END IF;
      END $$;
    `);
  }
}
