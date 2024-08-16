/**
 * @typedef {'development' | 'test' | 'production' | 'seed'} OrmconfigKeys
 */

const { DataSource } = require('typeorm');

/**
 * type {{ [key in OrmconfigKeys]: import("typeorm").ConnectionOptions } }
 * @type {{ [key in OrmconfigKeys]: import("typeorm").DataSourceOptions } }
 */
const ormconfigObject = {
  development: {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: false,
    logging: true,
    migrations: ['db/migrations/*.js'],
    entities: ['src/**/*.entity.ts'],
  },
  seeds: {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: false,
    logging: true,
    migrations: ['db/seeds/*.js'],
    migrationsTableName: 'seeds',
  },
  test: {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: false,
    logging: false,
    migrations: ['db/migrations/*.js'],
  },
  production: {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: false,
    logging: false,
    migrations: ['db/migrations/*.js'],
  },
};

/**
 * @type {import("typeorm").DataSourceOptions}
 */
const ormconfig = ormconfigObject[process.env.NODE_ENV || 'development'];
// console.log('ormconfig', ormconfig);
exports.ormconfig = ormconfig;

const dataSource = new DataSource(ormconfig);
// console.log('dataSource', dataSource);
exports.default = dataSource;
