import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateReviewsTable1734353686461 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Создание таблицы `reviews`
    await queryRunner.createTable(
      new Table({
        name: 'reviews',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'rating',
            type: 'integer',
          },
          {
            name: 'comment',
            type: 'text',
            isNullable: true,
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
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'reviewer_id',
            type: 'uuid',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Внешний ключ на `users` (user_id)
    await queryRunner.createForeignKey(
      'reviews',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE', // Удаление всех отзывов при удалении пользователя
        onUpdate: 'CASCADE',
      }),
    );

    // Внешний ключ на `users` (reviewer_id)
    await queryRunner.createForeignKey(
      'reviews',
      new TableForeignKey({
        columnNames: ['reviewer_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL', // Оставить отзыв без рецензента при удалении пользователя
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Удаление внешних ключей и таблицы `reviews`
    const table = await queryRunner.getTable('reviews');
    if (table) {
      const userForeignKey = table.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('user_id') !== -1,
      );
      if (userForeignKey) {
        await queryRunner.dropForeignKey('reviews', userForeignKey);
      }

      const reviewerForeignKey = table.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('reviewer_id') !== -1,
      );
      if (reviewerForeignKey) {
        await queryRunner.dropForeignKey('reviews', reviewerForeignKey);
      }
    }

    await queryRunner.dropTable('reviews');
  }
}
