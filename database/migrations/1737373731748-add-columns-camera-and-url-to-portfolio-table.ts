import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddColumnsCameraAndUrlToPortfolioTable1737373731748
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('portfolio', [
      new TableColumn({
        name: 'camera',
        type: 'text',
        isNullable: true,
      }),
      new TableColumn({
        name: 'url',
        type: 'text',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('portfolio', 'camera');
    await queryRunner.dropColumn('portfolio', 'url');
  }
}
