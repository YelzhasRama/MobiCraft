import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddNullableRole1737462645163 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'users',
      'role',
      new TableColumn({
        name: 'role',
        type: 'enum',
        enumName: 'user_role_enum',
        enum: ['MOBILOGRAPH', 'CLIENT'],
        isNullable: true, // делаем столбец nullable
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'users',
      'role',
      new TableColumn({
        name: 'role',
        type: 'enum',
        enumName: 'user_role_enum',
        enum: ['MOBILOGRAPH', 'CLIENT'],
        isNullable: false, // возвращаем столбец как non-nullable
      }),
    );
  }
}
