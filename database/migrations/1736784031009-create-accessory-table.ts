import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateAccessoryTable1736784031009 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Создаем таблицу аксессуаров
    await queryRunner.createTable(
      new Table({
        name: 'accessories',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'text',
          },
        ],
      }),
    );

    // Создаем таблицу связи user_accessories для ManyToMany
    await queryRunner.createTable(
      new Table({
        name: 'user_accessories',
        columns: [
          {
            name: 'user_id',
            type: 'bigint',
          },
          {
            name: 'accessory_id',
            type: 'bigint',
          },
        ],
      }),
    );

    // Добавляем внешние ключи в таблицу связи
    await queryRunner.createForeignKey(
      'user_accessories',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'user_accessories',
      new TableForeignKey({
        columnNames: ['accessory_id'],
        referencedTableName: 'accessories',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // Создаем индекс для таблицы user_accessories
    await queryRunner.createIndex(
      'user_accessories',
      new TableIndex({
        name: 'user_accessories_index',
        columnNames: ['user_id', 'accessory_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Удаляем внешние ключи
    const userAccessoriesTable = await queryRunner.getTable('user_accessories');
    const foreignKeys = userAccessoriesTable.foreignKeys;
    await queryRunner.dropForeignKeys('user_accessories', foreignKeys);

    // Удаляем таблицу user_accessories
    await queryRunner.dropTable('user_accessories');

    // Удаляем таблицу accessories
    await queryRunner.dropTable('accessories');
  }
}
