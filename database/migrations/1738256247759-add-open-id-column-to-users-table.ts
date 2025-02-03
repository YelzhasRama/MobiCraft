import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddOpenIdColumnToUsersTable1738256247759
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'open_id',
        type: 'text',
        isNullable: true, // Поле не обязательно
        isUnique: true, // TikTok open_id уникален для каждого юзера
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'open_id');
  }
}
