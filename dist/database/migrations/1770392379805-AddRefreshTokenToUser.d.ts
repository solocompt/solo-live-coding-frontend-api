import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class AddRefreshTokenToUser1770392379805 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
