import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPaymentStateUserId1769655200000
  implements MigrationInterface
{
  name = 'AddPaymentStateUserId1769655200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "payment_state" ADD COLUMN "userId" varchar`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "payment_state" DROP COLUMN "userId"`);
  }
}
