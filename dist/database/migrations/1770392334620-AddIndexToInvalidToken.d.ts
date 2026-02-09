import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class AddIndexToInvalidToken1770392334620 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
