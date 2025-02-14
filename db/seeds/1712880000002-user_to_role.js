const { MigrationInterface, QueryRunner } = require('typeorm');

/**
 * @implements {MigrationInterface}
 */
module.exports = class UserToRole1712880000002 {
  name = 'UserToRole1712880000002';

  /** @param {QueryRunner} queryRunner */
  async up(queryRunner) {
    await queryRunner.query(`
INSERT INTO "user_to_role"
  ("user_id", "role_id")
VALUES
  (1, 1),
  (1, 2),
  (2, 1),
  (2, 2);
`);
  }

  /** @param {QueryRunner} queryRunner */
  async down(queryRunner) {}
};
