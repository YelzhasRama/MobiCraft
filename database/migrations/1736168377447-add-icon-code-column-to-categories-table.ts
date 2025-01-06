import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddIconCodeColumnToCategoriesTable1736168377447
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Добавление нового столбца iconCode в таблицу categories
    await queryRunner.addColumn(
      'categories', // Название таблицы
      new TableColumn({
        name: 'icon_code', // Имя столбца
        type: 'text', // Тип данных
        isNullable: true, // Столбец может быть пустым
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Удаление столбца iconCode из таблицы categories (при откате миграции)
    await queryRunner.dropColumn('categories', 'icon_code');
  }
}
