require('dotenv').config();

module.exports = {
	development: {
		client: 'pg',
		debug: true,
		connection: {
			host: 'db',
			database: process.env.POSTGRES_DB,
			user: process.env.POSTGRES_USER,
			password: process.env.POSTGRES_PASSWORD,
		},
		pool: {
			min: 2,
			max: 10
		},
		migrations: {
			directory: './db/migrations',
		},
		seeds: {
			directory: './db/seeds',
		},
	}
};