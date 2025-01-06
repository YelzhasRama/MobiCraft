import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddNullableColumnsToOrdersTable1736174921085
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'orders',
      'title',
      new TableColumn({
        name: 'title',
        type: 'text',
        isNullable: true,
      }),
    );
    await queryRunner.changeColumn(
      'orders',
      'description',
      new TableColumn({
        name: 'description',
        type: 'text',
        isNullable: true,
      }),
    );
    await queryRunner.changeColumn(
      'orders',
      'shooting_date',
      new TableColumn({
        name: 'shooting_date',
        type: 'text',
        isNullable: true,
      }),
    );
    await queryRunner.changeColumn(
      'orders',
      'city',
      new TableColumn({
        name: 'city',
        type: 'text',
        isNullable: true,
      }),
    );
    await queryRunner.changeColumn(
      'orders',
      'chronometry',
      new TableColumn({
        name: 'chronometry',
        type: 'text',
        isNullable: true,
      }),
    );
    await queryRunner.changeColumn(
      'orders',
      'client_name',
      new TableColumn({
        name: 'client_name',
        type: 'text',
        isNullable: true,
      }),
    );
    await queryRunner.changeColumn(
      'orders',
      'deleted_at',
      new TableColumn({
        name: 'deleted_at',
        type: 'timestamptz',
        isNullable: true,
      }),
    );
    await queryRunner.changeColumn(
      'orders',
      'client_id',
      new TableColumn({
        name: 'client_id',
        type: 'bigint',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Здесь можно вернуть все поля к их прежнему состоянию, если они были не nullable
    await queryRunner.changeColumn(
      'orders',
      'title',
      new TableColumn({
        name: 'title',
        type: 'text',
        isNullable: false, // возвращаем обратно в non-nullable
      }),
    );
    await queryRunner.changeColumn(
      'orders',
      'description',
      new TableColumn({
        name: 'description',
        type: 'text',
        isNullable: false,
      }),
    );
    await queryRunner.changeColumn(
      'orders',
      'shooting_date',
      new TableColumn({
        name: 'shooting_date',
        type: 'text',
        isNullable: false,
      }),
    );
    await queryRunner.changeColumn(
      'orders',
      'city',
      new TableColumn({
        name: 'city',
        type: 'text',
        isNullable: false,
      }),
    );
    await queryRunner.changeColumn(
      'orders',
      'chronometry',
      new TableColumn({
        name: 'chronometry',
        type: 'text',
        isNullable: false,
      }),
    );
    await queryRunner.changeColumn(
      'orders',
      'client_name',
      new TableColumn({
        name: 'client_name',
        type: 'text',
        isNullable: false,
      }),
    );
    await queryRunner.changeColumn(
      'orders',
      'deleted_at',
      new TableColumn({
        name: 'deleted_at',
        type: 'timestamptz',
        isNullable: false,
      }),
    );
    await queryRunner.changeColumn(
      'orders',
      'client_id',
      new TableColumn({
        name: 'client_id',
        type: 'bigint',
        isNullable: false,
      }),
    );
  }
}
