import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateDevicesTable1737547913711 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Удаляем поле device из таблицы users
    await queryRunner.dropColumn('users', 'device');

    // Создаем таблицу devices
    await queryRunner.createTable(
      new Table({
        name: 'devices',
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
            isNullable: true,
          },
          {
            name: 'model',
            type: 'text',
            isNullable: true,
          },
        ],
      }),
    );

    // Создаем таблицу user_devices для связи ManyToMany
    await queryRunner.createTable(
      new Table({
        name: 'user_devices',
        columns: [
          {
            name: 'user_id',
            type: 'bigint',
          },
          {
            name: 'device_id',
            type: 'bigint',
          },
        ],
      }),
    );

    // Добавляем внешние ключи в таблицу user_devices
    await queryRunner.createForeignKey(
      'user_devices',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'user_devices',
      new TableForeignKey({
        columnNames: ['device_id'],
        referencedTableName: 'devices',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // Создаем индекс для таблицы user_devices
    await queryRunner.createIndex(
      'user_devices',
      new TableIndex({
        name: 'user_devices_index',
        columnNames: ['user_id', 'device_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Удаляем внешние ключи
    const userDevicesTable = await queryRunner.getTable('user_devices');
    const foreignKeys = userDevicesTable.foreignKeys;
    await queryRunner.dropForeignKeys('user_devices', foreignKeys);

    // Удаляем таблицу user_devices
    await queryRunner.dropTable('user_devices');

    // Удаляем таблицу devices
    await queryRunner.dropTable('devices');

    // Добавляем поле device обратно в таблицу users
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'device',
        type: 'text',
        isNullable: true,
      }),
    );
  }
}
