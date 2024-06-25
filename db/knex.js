import knex from 'knex';
import config from '../knexfile.js';
import dotenv from 'dotenv';
dotenv.config();

const environment = process.env.ENVIRONMENT || 'development';
const knexConfig = config[environment];

const db = knex(knexConfig);

export default db;