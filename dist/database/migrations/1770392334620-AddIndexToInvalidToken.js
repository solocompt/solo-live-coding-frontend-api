"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddIndexToInvalidToken1770392334620 = void 0;
class AddIndexToInvalidToken1770392334620 {
    name = 'AddIndexToInvalidToken1770392334620';
    async up(queryRunner) {
        await queryRunner.query(`CREATE INDEX "IDX_8db4707152f5bf931cf97985c3" ON "invalid_token" ("token") `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_8db4707152f5bf931cf97985c3"`);
    }
}
exports.AddIndexToInvalidToken1770392334620 = AddIndexToInvalidToken1770392334620;
//# sourceMappingURL=1770392334620-AddIndexToInvalidToken.js.map