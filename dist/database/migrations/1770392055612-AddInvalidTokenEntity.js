"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddInvalidTokenEntity1770392055612 = void 0;
class AddInvalidTokenEntity1770392055612 {
    name = 'AddInvalidTokenEntity1770392055612';
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "invalid_token" ("id" varchar PRIMARY KEY NOT NULL, "token" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')))`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "invalid_token"`);
    }
}
exports.AddInvalidTokenEntity1770392055612 = AddInvalidTokenEntity1770392055612;
//# sourceMappingURL=1770392055612-AddInvalidTokenEntity.js.map