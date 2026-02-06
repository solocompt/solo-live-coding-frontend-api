import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIndexToInvalidToken1770392334620 implements MigrationInterface {
  name = 'AddIndexToInvalidToken1770392334620';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IDX_8db4707152f5bf931cf97985c3" ON "invalid_token" ("token") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_8db4707152f5bf931cf97985c3"`);
  }
}
