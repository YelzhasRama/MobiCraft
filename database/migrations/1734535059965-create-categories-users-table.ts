import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateCategoriesUsersTable1734535059965
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'categories_users',
        columns: [
          {
            name: 'category_id',
            type: 'bigint',
            isPrimary: true,
          },
          {
            name: 'user_id',
            type: 'bigint',
            isPrimary: true,
          },
        ],
      }),
    );

    await queryRunner.createForeignKeys('categories_users', [
      new TableForeignKey({
        columnNames: ['category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'categories',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('categories_users');
    const foreignKeys = table?.foreignKeys || [];

    await queryRunner.dropForeignKeys('categories_users', foreignKeys);
    await queryRunner.dropTable('categories_users');
  }
}
