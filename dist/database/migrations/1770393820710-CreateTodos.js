"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTodos1770393820710 = void 0;
class CreateTodos1770393820710 {
    name = 'CreateTodos1770393820710';
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "todos" ("id" varchar PRIMARY KEY NOT NULL, "content" varchar(255) NOT NULL, "isCompleted" boolean NOT NULL DEFAULT (0), "expiresAt" datetime, "userId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "temporary_todos" ("id" varchar PRIMARY KEY NOT NULL, "content" varchar(255) NOT NULL, "isCompleted" boolean NOT NULL DEFAULT (0), "expiresAt" datetime, "userId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_4583be7753873b4ead956f040e3" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_todos"("id", "content", "isCompleted", "expiresAt", "userId", "createdAt", "updatedAt") SELECT "id", "content", "isCompleted", "expiresAt", "userId", "createdAt", "updatedAt" FROM "todos"`);
        await queryRunner.query(`DROP TABLE "todos"`);
        await queryRunner.query(`ALTER TABLE "temporary_todos" RENAME TO "todos"`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "todos" RENAME TO "temporary_todos"`);
        await queryRunner.query(`CREATE TABLE "todos" ("id" varchar PRIMARY KEY NOT NULL, "content" varchar(255) NOT NULL, "isCompleted" boolean NOT NULL DEFAULT (0), "expiresAt" datetime, "userId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "todos"("id", "content", "isCompleted", "expiresAt", "userId", "createdAt", "updatedAt") SELECT "id", "content", "isCompleted", "expiresAt", "userId", "createdAt", "updatedAt" FROM "temporary_todos"`);
        await queryRunner.query(`DROP TABLE "temporary_todos"`);
        await queryRunner.query(`DROP TABLE "todos"`);
    }
}
exports.CreateTodos1770393820710 = CreateTodos1770393820710;
//# sourceMappingURL=1770393820710-CreateTodos.js.map