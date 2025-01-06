import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnsToUserTable1736166777875 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN "full_name" text NULL,
      ADD COLUMN "where_am_i" text NULL,
      ADD COLUMN "price_unit" text NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      DROP COLUMN "full_name",
      DROP COLUMN "where_am_i",
      DROP COLUMN "price_unit";
    `);
  }
}
