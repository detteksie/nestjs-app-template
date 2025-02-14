const { MigrationInterface, QueryRunner } = require('typeorm');

/**
 * @implements {MigrationInterface}
 */
module.exports = class UserToRole1712880000002 {
  name = 'UserToRole1712880000002';

  /** @param {QueryRunner} queryRunner */
  async up(queryRunner) {
    await queryRunner.query(`
CREATE TABLE "user_to_role" (
  "created_at" TIMESTAMP NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
  "deleted_at" TIMESTAMP,
  "user_id" bigint NOT NULL,
  "role_id" bigint NOT NULL,
  CONSTRAINT "PK_ebeca66c6362a547803adc9c9ce" PRIMARY KEY ("role_id", "user_id")
)`);
    await queryRunner.query(
      `CREATE INDEX "IDX_cbe516445858eb55127cbaa680" ON "user_to_role" ("role_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cf3d99d0316e0fb041a6a61738" ON "user_to_role" ("user_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_to_role" ADD CONSTRAINT "FK_cf3d99d0316e0fb041a6a61738d" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_to_role" ADD CONSTRAINT "FK_cbe516445858eb55127cbaa6801" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  /** @param {QueryRunner} queryRunner */
  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "user_to_role" DROP CONSTRAINT "FK_cbe516445858eb55127cbaa6801"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_to_role" DROP CONSTRAINT "FK_cf3d99d0316e0fb041a6a61738d"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_cf3d99d0316e0fb041a6a61738"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_cbe516445858eb55127cbaa680"`);
    await queryRunner.query(`DROP TABLE "user_to_role"`);
  }
};
