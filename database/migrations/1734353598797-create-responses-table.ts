import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateResponsesTable1734353598797 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Создание таблицы `responses`
    await queryRunner.createTable(
      new Table({
        name: 'responses',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'message',
            type: 'text',
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['PENDING', 'ACCEPTED', 'REJECTED'], // Замените на фактические значения ResponseStatus
            default: `'PENDING'`,
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
            name: 'order_id',
            type: 'uuid',
          },
          {
            name: 'mobilograph_id',
            type: 'uuid',
          },
        ],
      }),
      true,
    );

    // Внешний ключ на `orders` (order_id)
    await queryRunner.createForeignKey(
      'responses',
      new TableForeignKey({
        columnNames: ['order_id'],
        referencedTableName: 'orders',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    // Внешний ключ на `users` (mobilograph_id)
    await queryRunner.createForeignKey(
      'responses',
      new TableForeignKey({
        columnNames: ['mobilograph_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Удаление внешних ключей и таблицы `responses`
    const table = await queryRunner.getTable('responses');
    if (table) {
      const orderForeignKey = table.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('order_id') !== -1,
      );
      if (orderForeignKey) {
        await queryRunner.dropForeignKey('responses', orderForeignKey);
      }

      const mobilographForeignKey = table.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('mobilograph_id') !== -1,
      );
      if (mobilographForeignKey) {
        await queryRunner.dropForeignKey('responses', mobilographForeignKey);
      }
    }

    await queryRunner.dropTable('responses');
  }
}
