import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class ChangeTypeOfShootingDateInPortfolioTable1737377489329
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'portfolio',
      'shoot_date',
      new TableColumn({
        name: 'shoot_date',
        type: 'text',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'portfolio',
      'shoot_date',
      new TableColumn({
        name: 'shoot_date',
        type: 'date',
        isNullable: true,
      }),
    );
  }
}
