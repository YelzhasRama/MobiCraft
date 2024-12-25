import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUserRefreshTokensTable1734806434381
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_refresh_tokens',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'user_id',
            type: 'bigint',
          },
          {
            name: 'token',
            type: 'text',
          },
          {
            name: 'expires_at',
            type: 'timestamptz',
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
        ],
        foreignKeys: [
          {
            name: 'user_refresh_tokens_user_id_foreign_key',
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'user_refresh_tokens',
      'user_refresh_tokens_user_id_foreign_key',
    );

    await queryRunner.dropTable('user_refresh_tokens');
  }
}
