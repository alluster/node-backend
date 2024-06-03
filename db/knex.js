import knex from 'knex';
import config from '../knexfile.js';

const environment = process.env.ENVIRONMENT || 'development';
const knexConfig = config[environment];

const db = knex(knexConfig);

export default db;