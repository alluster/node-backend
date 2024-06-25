import knex from 'knex';
import config from '../knexfile.js';
import dotenv from 'dotenv';
dotenv.config();

const environment = process.env.ENVIRONMENT || 'development';
const knexConfig = config[environment];
console.log('environment in knex.js:', process.env.ENVIRONMENT)

const db = knex(knexConfig);
db.raw('SELECT 1')
	.then(() => {
		console.log('Database connection successful');
	})
	.catch(err => {
		console.error('Database connection failed:', err);
	});
export default db;