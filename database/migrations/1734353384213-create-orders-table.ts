import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateOrdersTable1734353384213 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Создание таблицы `orders`
    await queryRunner.createTable(
      new Table({
        name: 'orders',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'title',
            type: 'text',
          },
          {
            name: 'description',
            type: 'text',
          },
          {
            name: 'shooting_date',
            type: 'date',
          },
          {
            name: 'budget',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'location',
            type: 'text',
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            default: 'now()',
          },
          {
            name: 'deleted_at',
            type: 'timestamptz',
            isNullable: true,
          },
          {
            name: 'client_id',
            type: 'uuid',
          },
          {
            name: 'category_id',
            type: 'bigint',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Внешний ключ на `users` (client_id)
    await queryRunner.createForeignKey(
      'orders',
      new TableForeignKey({
        columnNames: ['client_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    // Внешний ключ на `categories` (category_id)
    await queryRunner.createForeignKey(
      'orders',
      new TableForeignKey({
        columnNames: ['category_id'],
        referencedTableName: 'categories',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Удаление таблицы `orders`
    const table = await queryRunner.getTable('orders');
    if (table) {
      // Удаление всех внешних ключей
      const foreignKeys = table.foreignKeys;
      for (const fk of foreignKeys) {
        await queryRunner.dropForeignKey('orders', fk);
      }
    }

    await queryRunner.dropTable('orders');
  }
}
