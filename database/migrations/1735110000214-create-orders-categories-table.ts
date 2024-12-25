import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateOrdersCategoriesTable1735110000214
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Создание таблицы orders_categories
    await queryRunner.createTable(
      new Table({
        name: 'orders_categories',
        columns: [
          {
            name: 'order_id',
            type: 'bigint',
            isPrimary: true, // Составной первичный ключ
          },
          {
            name: 'category_id',
            type: 'bigint',
            isPrimary: true, // Составной первичный ключ
          },
        ],
      }),
    );

    // Добавление внешних ключей
    await queryRunner.createForeignKeys('orders_categories', [
      new TableForeignKey({
        columnNames: ['order_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'orders',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'categories',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Получение таблицы и удаление внешних ключей
    const table = await queryRunner.getTable('orders_categories');
    const foreignKeys = table?.foreignKeys || [];
    await queryRunner.dropForeignKeys('orders_categories', foreignKeys);

    // Удаление самой таблицы
    await queryRunner.dropTable('orders_categories');
  }
}
