import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateUsersTable1734353212507 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Создание типов для ролей и гендера
    await queryRunner.query(`
      CREATE TYPE user_role_enum AS ENUM ('Admin', 'User', 'Manager');
      CREATE TYPE gender_enum AS ENUM ('Male', 'Female', 'Other');
    `);

    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'email',
            type: 'text',
            isUnique: true,
          },
          {
            name: 'password',
            type: 'text',
          },
          {
            name: 'role',
            type: 'enum',
            enumName: 'user_role_enum',
            enum: ['Admin', 'User', 'Manager'],
          },
          {
            name: 'name',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'gender',
            type: 'enum',
            enumName: 'gender_enum',
            enum: ['Male', 'Female', 'Other'],
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
        ],
      }),
    );

    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'users_email_index',
        columnNames: ['email'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('users', 'users_email_index');
    await queryRunner.query('DROP TYPE user_role_enum;');
    await queryRunner.query('DROP TYPE gender_enum;');
    await queryRunner.dropTable('users');
  }
}
