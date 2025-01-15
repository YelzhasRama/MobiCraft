import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddColumnEmailVerifiedAtToUsersTable1736742916678
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'email_verified_at',
        type: 'timestamptz',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'email_verified_at');
  }
}
