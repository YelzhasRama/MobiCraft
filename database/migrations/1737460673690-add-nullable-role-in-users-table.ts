import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNullableRoleInUsersTable1737460673690
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users ALTER COLUMN role DROP NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users ALTER COLUMN role SET NOT NULL;
    `);
  }
}
