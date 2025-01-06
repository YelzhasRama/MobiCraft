import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateOrdersTable1734353384213 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'orders',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'title',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'shooting_date',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'city',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'chronometry',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'client_name',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'views_count',
            type: 'integer',
            default: 0,
          },
          {
            name: 'total_budget',
            type: 'decimal',
            precision: 10,
            scale: 2,
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
            type: 'bigint',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Foreign key for client_id
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('orders');
    if (table) {
      const foreignKeys = table.foreignKeys;
      for (const fk of foreignKeys) {
        await queryRunner.dropForeignKey('orders', fk);
      }
    }
    await queryRunner.dropTable('orders');
  }
}
