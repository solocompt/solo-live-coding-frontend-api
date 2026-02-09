import { MigrationInterface, QueryRunner } from "typeorm";
export declare class CreateTodos1770393820710 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
