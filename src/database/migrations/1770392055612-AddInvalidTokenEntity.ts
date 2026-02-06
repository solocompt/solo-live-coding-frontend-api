import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddInvalidTokenEntity1770392055612 implements MigrationInterface {
  name = 'AddInvalidTokenEntity1770392055612';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "invalid_token" ("id" varchar PRIMARY KEY NOT NULL, "token" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "invalid_token"`);
  }
}
