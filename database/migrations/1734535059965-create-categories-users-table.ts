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
    // Создание таблицы
    await queryRunner.createTable(
      new Table({
        name: 'categories_users',
        columns: [
          {
            name: 'category_id',
            type: 'bigint',
            isPrimary: true, // Составной первичный ключ
          },
          {
            name: 'user_id',
            type: 'bigint',
            isPrimary: true, // Составной первичный ключ
          },
        ],
      }),
    );

    // Добавление внешних ключей
    await queryRunner.createForeignKeys('categories_users', [
      new TableForeignKey({
        columnNames: ['category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'categories',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE', // Обновления на родительской таблице отражаются на дочерней
      }),
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE', // Обновления на родительской таблице отражаются на дочерней
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Получение таблицы и удаление внешних ключей
    const table = await queryRunner.getTable('categories_users');
    const foreignKeys = table?.foreignKeys || [];
    await queryRunner.dropForeignKeys('categories_users', foreignKeys);

    // Удаление самой таблицы
    await queryRunner.dropTable('categories_users');
  }
}
