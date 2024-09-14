// import knex from 'knex';
// import config from '../knexfile.js';
// import dotenv from 'dotenv';
// dotenv.config();

// const environment = process.env.ENVIRONMENT || 'development';
// const knexConfig = config[environment];

// const db = knex(knexConfig);
// db.raw('SELECT 1')
// 	.then(() => {
// 		console.log('Database connection successful');
// 	})
// 	.catch(err => {
// 		console.error('Database connection failed:', err);
// 	});
// export default db;


import knex from 'knex';
import config from '../knexfile.js';
import dotenv from 'dotenv';
dotenv.config();

const environment = process.env.ENVIRONMENT || 'development';
const knexConfig = config[environment];

let db;

if (process.env.NODE_ENV !== 'test') {
	db = knex(knexConfig);
	db.raw('SELECT 1')
		.then(() => {
			console.log('Database connection successful');
		})
		.catch(err => {
			if (process.env.NODE_ENV !== 'development') {
				console.error('Database connection failed:', err);
			}
		});
} else {
	console.log('Skipping database connection in test environment');
}

export default db;