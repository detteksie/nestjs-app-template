const { MigrationInterface, QueryRunner } = require('typeorm');

/**
 * @implements {MigrationInterface}
 */
module.exports = class Role1712880000001 {
  name = 'Role1712880000001';

  /** @param {QueryRunner} queryRunner */
  async up(queryRunner) {
    await queryRunner.query(`
INSERT INTO "role"
  ("id", "type")
VALUES
  (1, 'user'),
  (2, 'admin');
`);
  }

  /** @param {QueryRunner} queryRunner */
  async down(queryRunner) {}
};
