const { MigrationInterface, QueryRunner } = require('typeorm');

/**
 * @implements {MigrationInterface}
 */
module.exports = class Role1712880000001 {
  name = 'Role1712880000001';

  /** @param {QueryRunner} queryRunner */
  async up(queryRunner) {
    await queryRunner.query(`
CREATE TABLE "role" (
  "created_at" TIMESTAMP NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
  "deleted_at" TIMESTAMP,
  "id" BIGSERIAL NOT NULL,
  "type" character varying NOT NULL,
  CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2591c2" PRIMARY KEY ("id")
)`);
  }

  /** @param {QueryRunner} queryRunner */
  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE "role"`);
  }
};
