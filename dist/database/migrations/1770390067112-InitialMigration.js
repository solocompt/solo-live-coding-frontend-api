"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialMigration1770390067112 = void 0;
class InitialMigration1770390067112 {
    name = 'InitialMigration1770390067112';
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "users" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar(100) NOT NULL, "email" varchar(100) NOT NULL, "password" varchar(255) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "users"`);
    }
}
exports.InitialMigration1770390067112 = InitialMigration1770390067112;
//# sourceMappingURL=1770390067112-InitialMigration.js.map