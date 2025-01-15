import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateFavoritesTable1736925577301 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Создаем таблицу favorites
        await queryRunner.createTable(
          new Table({
              name: "favorites",
              columns: [
                  {
                      name: "id",
                      type: "bigint",
                      isPrimary: true,
                      isGenerated: true,
                      generationStrategy: "increment",
                  },
                  {
                      name: "user_id",
                      type: "bigint",
                      isNullable: false,
                  },
                  {
                      name: "order_id",
                      type: "bigint",
                      isNullable: true,
                  },
                  {
                      name: "created_at",
                      type: "timestamptz",
                      default: "now()",
                  },
                  {
                      name: "updated_at",
                      type: "timestamptz",
                      default: "now()",
                  },
                  {
                      name: "deleted_at",
                      type: "timestamptz",
                      isNullable: true,
                  },
              ],
          }),
          true
        );

        // Добавляем внешний ключ для user_id
        await queryRunner.createForeignKey(
          "favorites",
          new TableForeignKey({
              columnNames: ["user_id"],
              referencedColumnNames: ["id"],
              referencedTableName: "users",
              onDelete: "CASCADE",
              onUpdate: "CASCADE",
          })
        );

        // Добавляем внешний ключ для order_id
        await queryRunner.createForeignKey(
          "favorites",
          new TableForeignKey({
              columnNames: ["order_id"],
              referencedColumnNames: ["id"],
              referencedTableName: "orders",
              onDelete: "SET NULL",
              onUpdate: "CASCADE",
          })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Удаляем таблицу favorites
        await queryRunner.dropTable("favorites", true);
    }
}
