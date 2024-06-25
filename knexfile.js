import dotenv from 'dotenv';
dotenv.config();

export const config = {
	development: {
		client: 'pg',
		connection: {
			connectionString: `${process.env.DATABASE_URL}`,
			ssl: { rejectUnauthorized: false },
		},
		pool: {
			min: 2,
			max: 10,
		},
		migrations: {
			directory: './db/migrations',
		},
		seeds: {
			directory: './db/seeds',
		},
	},
	production: {
		client: 'pg',
		connection: {
			connectionString: `${process.env.DATABASE_URL}`,
			ssl: { rejectUnauthorized: false },
		},
		pool: {
			min: 2,
			max: 10,
		},
		migrations: {
			directory: './db/migrations',
		},
		seeds: {
			directory: './db/seeds',
		},
	},
};

export default config;
