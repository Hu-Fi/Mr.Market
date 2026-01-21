import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatePaymentStateFor4Transfers1735300000000
    implements MigrationInterface {
    name = 'UpdatePaymentStateFor4Transfers1735300000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Rename old columns to new structure
        await queryRunner.query(
            `ALTER TABLE "payment_state" RENAME COLUMN "firstAssetId" TO "baseAssetId"`,
        );
        await queryRunner.query(
            `ALTER TABLE "payment_state" RENAME COLUMN "firstAssetAmount" TO "baseAssetAmount"`,
        );
        await queryRunner.query(
            `ALTER TABLE "payment_state" RENAME COLUMN "firstSnapshotId" TO "baseAssetSnapshotId"`,
        );
        await queryRunner.query(
            `ALTER TABLE "payment_state" RENAME COLUMN "secondAssetId" TO "quoteAssetId"`,
        );
        await queryRunner.query(
            `ALTER TABLE "payment_state" RENAME COLUMN "secondAssetAmount" TO "quoteAssetAmount"`,
        );
        await queryRunner.query(
            `ALTER TABLE "payment_state" RENAME COLUMN "secondSnapshotId" TO "quoteAssetSnapshotId"`,
        );

        // Make quoteAssetId NOT NULL (it was nullable before)
        await queryRunner.query(
            `ALTER TABLE "payment_state" ALTER COLUMN "quoteAssetId" SET NOT NULL`,
        );

        // Set default values for baseAssetAmount and quoteAssetAmount
        await queryRunner.query(
            `ALTER TABLE "payment_state" ALTER COLUMN "baseAssetAmount" SET DEFAULT '0'`,
        );
        await queryRunner.query(
            `ALTER TABLE "payment_state" ALTER COLUMN "quoteAssetAmount" SET DEFAULT '0'`,
        );

        // Add new fee-related columns
        await queryRunner.query(
            `ALTER TABLE "payment_state" ADD "baseFeeAssetId" character varying`,
        );
        await queryRunner.query(
            `ALTER TABLE "payment_state" ADD "baseFeeAssetAmount" character varying NOT NULL DEFAULT '0'`,
        );
        await queryRunner.query(
            `ALTER TABLE "payment_state" ADD "baseFeeAssetSnapshotId" character varying`,
        );
        await queryRunner.query(
            `ALTER TABLE "payment_state" ADD "quoteFeeAssetId" character varying`,
        );
        await queryRunner.query(
            `ALTER TABLE "payment_state" ADD "quoteFeeAssetAmount" character varying NOT NULL DEFAULT '0'`,
        );
        await queryRunner.query(
            `ALTER TABLE "payment_state" ADD "quoteFeeAssetSnapshotId" character varying`,
        );

        // Add required fee columns
        await queryRunner.query(
            `ALTER TABLE "payment_state" ADD "requiredBaseWithdrawalFee" character varying`,
        );
        await queryRunner.query(
            `ALTER TABLE "payment_state" ADD "requiredQuoteWithdrawalFee" character varying`,
        );
        await queryRunner.query(
            `ALTER TABLE "payment_state" ADD "requiredMarketMakingFee" character varying`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove new columns
        await queryRunner.query(
            `ALTER TABLE "payment_state" DROP COLUMN "requiredMarketMakingFee"`,
        );
        await queryRunner.query(
            `ALTER TABLE "payment_state" DROP COLUMN "requiredQuoteWithdrawalFee"`,
        );
        await queryRunner.query(
            `ALTER TABLE "payment_state" DROP COLUMN "requiredBaseWithdrawalFee"`,
        );
        await queryRunner.query(
            `ALTER TABLE "payment_state" DROP COLUMN "quoteFeeAssetSnapshotId"`,
        );
        await queryRunner.query(
            `ALTER TABLE "payment_state" DROP COLUMN "quoteFeeAssetAmount"`,
        );
        await queryRunner.query(
            `ALTER TABLE "payment_state" DROP COLUMN "quoteFeeAssetId"`,
        );
        await queryRunner.query(
            `ALTER TABLE "payment_state" DROP COLUMN "baseFeeAssetSnapshotId"`,
        );
        await queryRunner.query(
            `ALTER TABLE "payment_state" DROP COLUMN "baseFeeAssetAmount"`,
        );
        await queryRunner.query(
            `ALTER TABLE "payment_state" DROP COLUMN "baseFeeAssetId"`,
        );

        // Remove defaults
        await queryRunner.query(
            `ALTER TABLE "payment_state" ALTER COLUMN "quoteAssetAmount" DROP DEFAULT`,
        );
        await queryRunner.query(
            `ALTER TABLE "payment_state" ALTER COLUMN "baseAssetAmount" DROP DEFAULT`,
        );

        // Make quoteAssetId nullable again
        await queryRunner.query(
            `ALTER TABLE "payment_state" ALTER COLUMN "quoteAssetId" DROP NOT NULL`,
        );

        // Rename back to old column names
        await queryRunner.query(
            `ALTER TABLE "payment_state" RENAME COLUMN "quoteAssetSnapshotId" TO "secondSnapshotId"`,
        );
        await queryRunner.query(
            `ALTER TABLE "payment_state" RENAME COLUMN "quoteAssetAmount" TO "secondAssetAmount"`,
        );
        await queryRunner.query(
            `ALTER TABLE "payment_state" RENAME COLUMN "quoteAssetId" TO "secondAssetId"`,
        );
        await queryRunner.query(
            `ALTER TABLE "payment_state" RENAME COLUMN "baseAssetSnapshotId" TO "firstSnapshotId"`,
        );
        await queryRunner.query(
            `ALTER TABLE "payment_state" RENAME COLUMN "baseAssetAmount" TO "firstAssetAmount"`,
        );
        await queryRunner.query(
            `ALTER TABLE "payment_state" RENAME COLUMN "baseAssetId" TO "firstAssetId"`,
        );
    }
}
